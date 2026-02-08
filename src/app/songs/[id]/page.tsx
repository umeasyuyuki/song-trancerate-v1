import { createClient } from "@/utils/supabase/server";
import { lookupSong } from "@/lib/itunes";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function SongPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;

    // 1. Check if song exists in DB
    const { data: songData } = await supabase
        .from("songs")
        .select("*, lyrics(*)")
        .eq("itunes_id", id)
        .single();

    // specific handling for 1:1 relation (PostgREST returns object if unique constraint exists)
    const lyrics = Array.isArray(songData?.lyrics) ? songData?.lyrics[0] : songData?.lyrics;

    if (songData && lyrics) {
        // Song and Lyrics found - Show Split View
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-start gap-6 mb-8">
                        {songData.album_art_url && (
                            <Image
                                src={songData.album_art_url}
                                alt={songData.title}
                                width={100}
                                height={100}
                                className="rounded-lg shadow"
                            />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold">{songData.title}</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">{songData.artist}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Original Lyrics (EN)</h2>
                            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
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
                </div>
            </main>
        );
    }

    // 2. Not found in DB -> Fetch from iTunes to show "Add" prompt
    const itunesSong = await lookupSong(id);

    if (!itunesSong) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
                <div className="w-24 h-24 relative mb-6">
                    <Image
                        src={itunesSong.artworkUrl100}
                        alt={itunesSong.trackName}
                        fill
                        className="rounded-lg shadow-lg"
                    />
                </div>
                <h1 className="text-3xl font-bold mb-2">{itunesSong.trackName}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{itunesSong.artistName}</p>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-100 dark:border-blue-800 max-w-lg">
                    <h3 className="text-xl font-semibold mb-2">Lyrics not found</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        We don&apos;t have lyrics for this song yet. Be the first to add them!
                    </p>
                    <Link
                        href={`/songs/add?id=${id}`}
                        className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-lg"
                    >
                        Add Lyrics & Translate
                    </Link>
                </div>
            </div>
        </main>
    );
}
