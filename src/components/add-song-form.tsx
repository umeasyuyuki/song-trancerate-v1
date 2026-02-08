"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { ItunesSong } from "@/lib/itunes";

export default function AddSongForm({ song }: { song: ItunesSong }) {
    const router = useRouter();
    const supabase = createClient();

    const [lyricsEn, setLyricsEn] = useState("");
    const [lyricsJa, setLyricsJa] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleTranslate = async () => {
        if (!lyricsEn.trim()) return;
        setIsTranslating(true);
        setError("");

        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: lyricsEn }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Translation failed");

            setLyricsJa(data.text);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("You must be logged in to submit lyrics.");
            }

            // 1. Upsert Song
            const { data: songData, error: songError } = await supabase
                .from("songs")
                .upsert({
                    itunes_id: song.trackId.toString(),
                    title: song.trackName,
                    artist: song.artistName,
                    album_art_url: song.artworkUrl100,
                    preview_url: song.previewUrl,
                }, { onConflict: "itunes_id" })
                .select()
                .single();

            if (songError) throw songError;

            // 2. Insert Lyrics
            const { error: lyricsError } = await supabase
                .from("lyrics")
                .insert({
                    song_id: songData.id,
                    content_en: lyricsEn,
                    content_ja: lyricsJa,
                    created_by: user.id
                });

            if (lyricsError) throw lyricsError;

            // Success
            router.push(`/songs/${song.trackId}`);
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Lyrics */}
                <div>
                    <label className="block text-sm font-medium mb-2">Original Lyrics (English)</label>
                    <textarea
                        value={lyricsEn}
                        onChange={(e) => setLyricsEn(e.target.value)}
                        className="w-full h-96 p-4 rounded-lg border focus:ring-2 focus:ring-blue-500 font-serif"
                        placeholder="Paste English lyrics here..."
                        required
                    />
                </div>

                {/* Japanese Lyrics */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">Japanese Translation</label>
                        <button
                            type="button"
                            onClick={handleTranslate}
                            disabled={isTranslating || !lyricsEn}
                            className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                        >
                            {isTranslating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                            Translate with DeepL
                        </button>
                    </div>
                    <textarea
                        value={lyricsJa}
                        onChange={(e) => setLyricsJa(e.target.value)}
                        className="w-full h-96 p-4 rounded-lg border focus:ring-2 focus:ring-blue-500 font-sans"
                        placeholder="Japanese translation will appear here..."
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <Loader2 className="animate-spin" size={18} />}
                    Save Lyrics
                </button>
            </div>
        </form>
    );
}
