
'use client';

import { useState } from 'react';
import { updateLyrics } from '@/app/actions';
import { Pencil, Save, X } from 'lucide-react';

interface LyricsEditorProps {
    songId: string;
    initialLyricsEn: string;
    initialLyricsJa: string;
}

export default function LyricsEditor({ songId, initialLyricsEn, initialLyricsJa }: LyricsEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [lyricsEn, setLyricsEn] = useState(initialLyricsEn);
    const [lyricsJa, setLyricsJa] = useState(initialLyricsJa);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateLyrics(songId, lyricsEn, lyricsJa);
            setIsEditing(false);
            // Optional: Toast success
        } catch (error) {
            console.error("Failed to save lyrics:", error);
            alert("Failed to save lyrics. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md transition text-gray-700 dark:text-gray-300"
            >
                <Pencil size={14} /> Edit Lyrics
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900 rounded-t-xl">
                    <h2 className="font-bold text-lg">Edit Lyrics</h2>
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm text-gray-500">English</label>
                        <textarea
                            value={lyricsEn}
                            onChange={(e) => setLyricsEn(e.target.value)}
                            className="flex-1 min-h-[400px] p-4 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-950 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="English lyrics..."
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-sm text-gray-500">Japanese</label>
                        <textarea
                            value={lyricsJa}
                            onChange={(e) => setLyricsJa(e.target.value)}
                            className="flex-1 min-h-[400px] p-4 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-950 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Japanese translation..."
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 rounded-b-xl flex justify-end gap-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-zinc-800 rounded-lg transition"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
