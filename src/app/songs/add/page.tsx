import { lookupSong } from "@/lib/itunes";
import AddSongForm from "@/components/add-song-form";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AddSongPage({ searchParams }: { searchParams: { id: string } }) {
    if (!searchParams.id) {
        redirect("/");
    }

    // Auth protection
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Login Required</h1>
                    <p className="mb-6">You need to sign in to contribute lyrics.</p>
                    <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Login</a>
                </div>
            </main>
        );
    }

    const song = await lookupSong(searchParams.id);

    if (!song) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-6 mb-8 border-b pb-8">
                    <div className="relative w-24 h-24">
                        <Image
                            src={song.artworkUrl100}
                            alt={song.trackName}
                            fill
                            className="rounded-lg shadow"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Add Lyrics: {song.trackName}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{song.artistName}</p>
                    </div>
                </div>

                <AddSongForm song={song} />
            </div>
        </main>
    );
}
