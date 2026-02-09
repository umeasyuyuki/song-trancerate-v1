"use client";

import { useState } from "react";
import { Search, Trash2, Music } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

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

interface VocabSearchListProps {
    initialVocab: Vocabulary[];
}

export default function VocabSearchList({ initialVocab }: VocabSearchListProps) {
    const [vocab, setVocab] = useState<Vocabulary[]>(initialVocab);
    const [query, setQuery] = useState("");
    const supabase = createClient();

    const filteredVocab = vocab.filter((v) => {
        const q = query.toLowerCase();
        return (
            v.word.toLowerCase().includes(q) ||
            v.meaning.toLowerCase().includes(q) ||
            v.songs?.title.toLowerCase().includes(q) ||
            v.songs?.artist.toLowerCase().includes(q)
        );
    });

    const deleteVocab = async (id: string) => {
        if (!confirm("Are you sure you want to delete this word?")) return;

        const { error } = await supabase.from("vocabularies").delete().eq("id", id);
        if (!error) {
            setVocab(prev => prev.filter(v => v.id !== id));
        } else {
            alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search words, meanings, or songs..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-lg leading-5 bg-white dark:bg-zinc-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out sm:text-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* List */}
            {filteredVocab.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {query ? "No matches found." : "No vocabulary saved yet."}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredVocab.map((v) => (
                        <div key={v.id} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{v.word}</h3>
                                        {v.songs && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-200">
                                                <Music size={12} className="mr-1" />
                                                {v.songs.title}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{v.meaning}</p>
                                </div>
                                <button
                                    onClick={() => deleteVocab(v.id)}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                                    title="Delete from vocabulary"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
