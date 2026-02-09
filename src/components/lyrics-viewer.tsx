"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, BookOpen, Loader2, X } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface LyricsViewerProps {
    lyrics: {
        content_en: string;
        content_ja: string | null;
    };
    songId: string;
    songTitle: string;
    artist: string;
}

export default function LyricsViewer({ lyrics, songId, songTitle, artist }: LyricsViewerProps) {
    const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
    const [isExplaining, setIsExplaining] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [meaningInput, setMeaningInput] = useState("");
    const [isGeneratingMeaning, setIsGeneratingMeaning] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const handleSelection = () => {
            if (showSaveModal) return; // Don't change selection while modal is open

            const sel = window.getSelection();
            if (!sel || sel.toString().trim().length === 0) {
                return;
            }

            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect.width > 0) {
                setSelection({
                    text: sel.toString().trim(),
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                });
                setExplanation(null);
                setError(null);
            }
        };

        document.addEventListener("mouseup", handleSelection);
        return () => document.removeEventListener("mouseup", handleSelection);
    }, [showSaveModal]);

    const clearSelection = () => {
        setSelection(null);
        setExplanation(null);
        setShowSaveModal(false);
        setMeaningInput("");
        window.getSelection()?.removeAllRanges();
    };

    const handleExplain = async () => {
        if (!selection) return;
        setIsExplaining(true);
        setExplanation(null);
        setError(null);

        try {
            const res = await fetch("/api/explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: selection.text,
                    context: `Song: ${songTitle} by ${artist}`
                }),
            });

            const data = await res.json();
            if (res.status === 429) throw new Error("クレジットが不足しています。");
            if (!res.ok) throw new Error(data.text || data.error || "Failed to explain");

            setExplanation(data.text);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsExplaining(false);
        }
    };

    const openSaveModal = () => {
        setMeaningInput(explanation || ""); // Pre-fill if explanation exists
        setShowSaveModal(true);
    };

    const generateMeaningForInput = async () => {
        if (!selection) return;
        setIsGeneratingMeaning(true);
        try {
            const res = await fetch("/api/explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: selection.text,
                    context: `Song: ${songTitle} by ${artist}`
                }),
            });
            const data = await res.json();
            if (res.status === 429) {
                alert("クレジットが不足しています。");
                return;
            }
            if (!res.ok) throw new Error(data.error);

            // Clean up the response a bit if needed, or just set raw
            setMeaningInput(data.text);
        } catch (e) {
            console.error(e);
            alert("AI生成に失敗しました。");
        } finally {
            setIsGeneratingMeaning(false);
        }
    }

    const confirmSaveVocab = async () => {
        if (!selection) return;
        setIsSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Please login to save words.");
            setIsSaving(false);
            return;
        }

        const { error } = await supabase.from("vocabularies").insert({
            user_id: user.id,
            song_id: songId,
            word: selection.text,
            meaning: meaningInput
        });

        if (error) {
            alert(error.message);
        } else {
            clearSelection();
            // Optional: Toast notification
        }
        setIsSaving(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Original Lyrics (EN)</h2>
                    <div
                        className="whitespace-pre-wrap font-serif text-lg leading-relaxed selection:bg-blue-200 dark:selection:bg-blue-800 cursor-text"
                    >
                        {lyrics.content_en}
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Japanese Translation</h2>
                    <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                        {lyrics.content_ja || "No translation available."}
                    </div>
                </div>
            </div>

            {/* Floating Toolbar */}
            {selection && !showSaveModal && (
                <div
                    className="fixed z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-lg p-4 w-80 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        left: Math.min(Math.max(10, selection.x - 160), window.innerWidth - 330),
                        top: selection.y - 180 > 0 ? selection.y - 180 : selection.y + 30
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start border-b pb-2 mb-2">
                        <h3 className="font-bold text-sm truncate w-60">Selected: &quot;{selection.text}&quot;</h3>
                        <button onClick={clearSelection}><X size={16} /></button>
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    {explanation ? (
                        <div className="text-sm bg-blue-50 dark:bg-blue-900/30 p-2 rounded max-h-40 overflow-y-auto">
                            <p className="whitespace-pre-wrap">{explanation}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500">Select an action for this text.</p>
                    )}

                    <div className="flex gap-2 mt-1">
                        <button
                            onClick={handleExplain}
                            disabled={isExplaining}
                            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-1.5 rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                            {isExplaining ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                            AI Tutor
                        </button>
                        <button
                            onClick={openSaveModal}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-1.5 rounded text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                            <BookOpen size={14} />
                            Save to Vocab
                        </button>
                    </div>
                </div>
            )}

            {/* Save Modal */}
            {showSaveModal && selection && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>💾</span> Save to Vocabulary
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Word / Phrase
                            </label>
                            <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded text-lg font-bold border border-gray-200 dark:border-zinc-700">
                                {selection.text}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Meaning / Memo
                            </label>
                            <textarea
                                value={meaningInput}
                                onChange={(e) => setMeaningInput(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded bg-transparent focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                placeholder="Enter meaning or use AI to generate..."
                            />
                            <button
                                onClick={generateMeaningForInput}
                                disabled={isGeneratingMeaning}
                                className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                            >
                                {isGeneratingMeaning ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                Auto-fill with AI
                            </button>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSaveVocab}
                                disabled={isSaving || !meaningInput.trim()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : null}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
