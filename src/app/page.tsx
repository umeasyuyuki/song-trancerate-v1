import { searchSongs } from "@/lib/itunes";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const results = query ? await searchSongs(query) : [];

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

        {query && (
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
        )}
      </div>
    </main>
  );
}
