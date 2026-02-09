"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

interface Song {
    id: string;
    title: string;
    artist: string;
    album_art_url: string | null;
    itunes_id: string;
}

interface SongFilterListProps {
    initialSongs: Song[];
    emptyMessage: string;
}

export default function SongFilterList({ initialSongs, emptyMessage }: SongFilterListProps) {
    const [query, setQuery] = useState("");

    const filteredSongs = initialSongs.filter((song) => {
        const q = query.toLowerCase();
        return (
            song.title.toLowerCase().includes(q) ||
            song.artist.toLowerCase().includes(q)
        );
    });

    return (
        <div>
            {/* Search Bar */}
            <div className="relative mb-8 max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Filter by title or artist..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-zinc-700 rounded-full leading-5 bg-white dark:bg-zinc-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* List */}
            {filteredSongs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {query ? "No matches found." : emptyMessage}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSongs.map((song) => (
                        <Link
                            key={song.id}
                            href={`/songs/${song.itunes_id}`}
                            className="block p-4 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition border border-gray-100 dark:border-zinc-700 hover:border-blue-500 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    {song.album_art_url ? (
                                        <Image
                                            src={song.album_art_url}
                                            alt={song.title}
                                            fill
                                            className="rounded object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center text-xs text-gray-500">
                                            No Art
                                        </div>
                                    )}
                                </div>
                                <div className="truncate">
                                    <h3 className="font-bold truncate text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{song.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
