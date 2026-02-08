export interface ItunesSong {
    wrapperType: string;
    kind: string;
    artistId: number;
    collectionId: number;
    trackId: number;
    artistName: string;
    collectionName: string;
    trackName: string;
    collectionCensoredName: string;
    trackCensoredName: string;
    artistViewUrl: string;
    collectionViewUrl: string;
    trackViewUrl: string;
    previewUrl: string;
    artworkUrl30: string;
    artworkUrl60: string;
    artworkUrl100: string;
    collectionPrice: number;
    trackPrice: number;
    releaseDate: string;
    collectionExplicitness: string;
    trackExplicitness: string;
    discCount: number;
    discNumber: number;
    trackCount: number;
    trackNumber: number;
    trackTimeMillis: number;
    country: string;
    currency: string;
    primaryGenreName: string;
    isStreamable: boolean;
}

export interface ItunesSearchResponse {
    resultCount: number;
    results: ItunesSong[];
}

export async function searchSongs(query: string, limit = 20): Promise<ItunesSong[]> {
    if (!query) return [];

    const params = new URLSearchParams({
        term: query,
        media: "music",
        entity: "song",
        limit: limit.toString(),
        country: "JP",
        lang: "ja_jp"
    });

    try {
        const res = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
        if (!res.ok) {
            throw new Error(`iTunes API error: ${res.statusText}`);
        }
        const data: ItunesSearchResponse = await res.json();
        return data.results;
    } catch (error) {
        console.error("Failed to search iTunes:", error);
        return [];
    }
}

export async function lookupSong(id: string): Promise<ItunesSong | null> {
    if (!id) return null;

    const params = new URLSearchParams({
        id: id,
        country: "JP",
        lang: "ja_jp"
    });

    try {
        const res = await fetch(`https://itunes.apple.com/lookup?${params.toString()}`);
        if (!res.ok) return null;
        const data: ItunesSearchResponse = await res.json();
        return data.results[0] || null;
    } catch (error) {
        console.error("Failed to lookup iTunes:", error);
        return null;
    }
}
