import { searchSongs } from "@/lib/itunes";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
// import VocabList from "@/components/vocab-list";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const results = query ? await searchSongs(query) : [];

  // Fetch Favorites if no query
  let favorites: any[] = [];
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!query && user) {
    const { data } = await supabase
      .from("likes")
      .select("songs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Flatten the structure: likes -> songs
    if (data) {
      favorites = data.map((item: any) => item.songs).filter(Boolean);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Song Trancerate
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Learn English through Lyrics. Search, Translate, Understand.
          </p>
          <SearchBar />
        </div>

        {query ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Results for &quot;{query}&quot;</h2>

            {results.length === 0 ? (
              <p className="text-gray-500">No songs found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((song) => (
                  <Link
                    key={song.trackId}
                    href={`/songs/${song.trackId}`}
                    className="block p-4 bg-white dark:bg-zinc-800 rounded-lg shadow hover:shadow-md transition border border-gray-100 dark:border-zinc-700 hover:border-blue-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={song.artworkUrl100}
                          alt={song.trackName}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold truncate">{song.trackName}</h3>
                        <p className="text-sm text-gray-500 truncate">{song.artistName}</p>
                        <p className="text-xs text-gray-400 mt-1">{song.collectionName}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Favorites & Vocab Section */
          /* Dashboard Links */
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/songs" className="block p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-blue-500 transition group">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-blue-600">
                <span>📚</span> Library
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore all songs with lyrics available.
              </p>
            </Link>

            <Link href="/favorites" className="block p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-red-500 transition group">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-red-500">
                <span>❤️</span> Favorites
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Access your liked songs collection.
              </p>
            </Link>

            <Link href="/vocabulary" className="block p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-green-500 transition group">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 group-hover:text-green-500">
                <span>📖</span> Vocabulary
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review words you&apos;ve saved while learning.
              </p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
