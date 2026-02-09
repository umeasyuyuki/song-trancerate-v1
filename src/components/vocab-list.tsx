"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2 } from "lucide-react";

interface Vocabulary {
    id: string;
    word: string;
    meaning: string;
    song_id: string;
    songs?: {
        title: string;
        artist: string;
    }
}

export default function VocabList() {
    const [vocab, setVocab] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Fetch vocab
    useEffect(() => {
        const fetchVocab = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("vocabularies")
                .select("*, songs(title, artist)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (data) setVocab(data);
            setLoading(false);
        };

        fetchVocab();
    }, [supabase]);

    const deleteVocab = async (id: string) => {
        const { error } = await supabase.from("vocabularies").delete().eq("id", id);
        if (!error) {
            setVocab(prev => prev.filter(v => v.id !== id));
        }
    };

    if (loading) return <div className="text-sm text-gray-500">Loading vocab...</div>;
    if (vocab.length === 0) return <div className="text-sm text-gray-500">No words saved yet. Select text in lyrics to add!</div>;

    return (
        <div className="space-y-4">
            {vocab.map((v) => (
                <div key={v.id} className="p-3 bg-white dark:bg-zinc-800 rounded border border-gray-100 dark:border-zinc-700 shadow-sm relative group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-blue-600 dark:text-blue-400">{v.word}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">{v.meaning}</p>
                            {v.songs && (
                                <p className="text-xs text-gray-400 mt-2">from {v.songs.title}</p>
                            )}
                        </div>
                        <button
                            onClick={() => deleteVocab(v.id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
