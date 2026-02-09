import { getExistSongs } from "@/lib/songs";
import SongFilterList from "@/components/song-filter-list";
import Link from "next/link";
import { ArrowLeft, Library } from "lucide-react";

export default async function SongsPage() {
    const songs = await getExistSongs();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Library className="text-blue-600" /> Song Library
                    </h1>
                </div>

                <div className="mb-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700">
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Browsing <strong>{songs.length}</strong> songs with registered lyrics.
                    </p>
                </div>

                <SongFilterList
                    initialSongs={songs}
                    emptyMessage="No songs with lyrics found yet. Be the first to add one!"
                />
            </div>
        </main>
    );
}
