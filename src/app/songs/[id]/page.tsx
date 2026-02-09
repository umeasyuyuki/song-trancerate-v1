import { createClient } from "@/utils/supabase/server";
import { lookupSong } from "@/lib/itunes";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import LyricsViewer from "@/components/lyrics-viewer";

export default async function SongPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { id } = params;

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Check if song exists in DB
    const { data: songData } = await supabase
        .from("songs")
        .select("*, lyrics(*)")
        .eq("itunes_id", id)
        .single();

    // specific handling for 1:1 relation (PostgREST returns object if unique constraint exists)
    const lyrics = Array.isArray(songData?.lyrics) ? songData?.lyrics[0] : songData?.lyrics;

    if (songData && lyrics) {
        // Song and Lyrics found - Show Split View

        // Fetch Like Status
        let isLiked = false;
        let likeCount = 0;

        if (songData) {
            const { count } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("song_id", songData.id);
            likeCount = count || 0;

            if (user) {
                const { data: likeData } = await supabase
                    .from("likes")
                    .select("created_at")
                    .eq("song_id", songData.id)
                    .eq("user_id", user.id)
                    .single();
                isLiked = !!likeData;
            }
        }

        return (
            <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                        {songData.album_art_url && (
                            <Image
                                src={songData.album_art_url}
                                alt={songData.title}
                                width={100}
                                height={100}
                                className="rounded-lg shadow flex-shrink-0"
                            />
                        )}
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold mb-1">{songData.title}</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{songData.artist}</p>

                            <div className="flex flex-wrap items-center gap-4">
                                <LikeButton
                                    songId={songData.id}
                                    userId={user?.id}
                                    initialIsLiked={isLiked}
                                    initialCount={likeCount}
                                />
                                {songData.preview_url && (
                                    <audio controls src={songData.preview_url} className="h-10">
                                        Your browser does not support the audio element.
                                    </audio>
                                )}
                            </div>
                        </div>
                    </div>

                    <LyricsViewer
                        lyrics={lyrics}
                        songId={songData.id}
                        songTitle={songData.title}
                        artist={songData.artist}
                    />
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
