
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { Client as GeniusClient } from 'genius-lyrics';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

// --- Configuration ---
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN?.trim(); // Optional
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST use Service Role for bypassing RLS

// Target Artists
const TARGET_ARTISTS = [
    "Taylor Swift",
    "Ed Sheeran",
    "Ariana Grande",
    "The Weeknd",
    "Dua Lipa",
    "Billie Eilish",
    "Olivia Rodrigo",
    "Justin Bieber",
    "Post Malone",
    "Harry Styles"
];

// Fetch many candidates to find new ones, but limit how many we add per run
const FETCH_LIMIT_CANDIDATES = 50;
const NEW_SONGS_PER_RUN_PER_ARTIST = 1;

// --- Initialization ---

console.log("Loading Env Vars from .env.local...");
console.log("LASTFM_API_KEY:", LASTFM_API_KEY ? "Set" : "Missing");
console.log("GENIUS_ACCESS_TOKEN:", GENIUS_ACCESS_TOKEN ? `Set (Length: ${GENIUS_ACCESS_TOKEN.length})` : "Missing");
console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Set" : "Missing");
console.log("SUPABASE_URL:", SUPABASE_URL ? "Set" : "Missing");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
    console.error("Missing required environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genius = new GeniusClient(GENIUS_ACCESS_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface SongMetadata {
    title: string;
    artist: string;
    mbid?: string;
    url?: string;
}

// --- Helper Functions ---

async function fetchTopTracksLastFM(artist: string): Promise<SongMetadata[]> {
    if (!LASTFM_API_KEY) {
        console.warn("LASTFM_API_KEY not set. Skipping Last.fm fetch.");
        return [];
    }
    try {
        const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artist)}&api_key=${LASTFM_API_KEY}&format=json&limit=${FETCH_LIMIT_CANDIDATES}`;
        const response = await axios.get(url);
        const tracks = response.data.toptracks.track;

        return tracks.map((t: any) => ({
            title: t.name,
            artist: t.artist.name,
            mbid: t.mbid,
            url: t.url
        }));
    } catch (error) {
        console.error(`Error fetching Last.fm for ${artist}:`, error);
        return [];
    }
}

async function fetchLyricsGenius(title: string, artist: string): Promise<string | null> {
    try {
        const searches = await genius.songs.search(`${title} ${artist}`);
        if (searches.length === 0) return null;

        const firstSong = searches[0];
        const lyrics = await firstSong.lyrics();
        return lyrics;
    } catch (error) {
        console.error(`Error fetching Genius lyrics for ${title}:`, error);
        return null;
    }
}

async function translateLyrics(text: string): Promise<string | null> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Translate the following song lyrics into Japanese.
    Preserve the line breaks and structure.
    Output ONLY the Japanese translation.
    
    Lyrics:
    ${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error translating lyrics:", error);
        return null;
    }
}

// Returns TRUE if a new song was successfully added
async function processSong(metadata: SongMetadata): Promise<boolean> {
    const { title, artist } = metadata;
    // console.log(`Checking: ${title} - ${artist}`); 

    // 1. Check if exists in DB (Strict Skip)
    const { data: existingSongs } = await supabase
        .from('songs')
        .select('id')
        .eq('title', title)
        .eq('artist', artist)
        .maybeSingle();

    if (existingSongs) {
        // console.log(`  Skipping: Already exists in DB.`);
        return false;
    }

    console.log(`Processing New Candidate: ${title} - ${artist}`);

    // 2. Upsert Song to get ID
    let itunesId = 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(7);
    let albumArt = '';
    let previewUrl = '';

    try {
        const itunesRes = await axios.get(`https://itunes.apple.com/search?term=${encodeURIComponent(title + " " + artist)}&media=music&limit=1`);
        if (itunesRes.data.resultCount > 0) {
            const track = itunesRes.data.results[0];
            itunesId = track.trackId.toString();
            albumArt = track.artworkUrl100;
            previewUrl = track.previewUrl;
            console.log(`  Matched iTunes ID: ${itunesId}`);
        }
    } catch (e) {
        console.warn("  iTunes search failed, using fallback ID.");
    }

    // Check conflict again with iTunes ID just in case
    const { data: checkId } = await supabase.from('songs').select('id').eq('itunes_id', itunesId).maybeSingle();
    if (checkId) {
        console.log("  Skipping: iTunes ID already exists.");
        return false;
    }

    const { data: songData, error: songError } = await supabase
        .from('songs')
        .upsert({
            itunes_id: itunesId,
            title: title,
            artist: artist,
            album_art_url: albumArt,
            preview_url: previewUrl
        }, { onConflict: 'itunes_id' })
        .select()
        .single();

    if (songError || !songData) {
        console.error("  Error saving song:", songError);
        return false;
    }

    const songId = songData.id;

    // 3. Fetch Lyrics
    console.log("  Fetching Lyrics...");
    const lyricsEn = await fetchLyricsGenius(title, artist);
    if (!lyricsEn) {
        console.log("  No lyrics found. Skipping save.");
        // If fetch returns null, we should ideally delete the empty song to verify it again later.
        await supabase.from('songs').delete().eq('id', songId);
        return false;
    }

    // 4. Translate
    console.log("  Translating...");
    let lyricsJa = await translateLyrics(lyricsEn);
    if (!lyricsJa) {
        console.warn("  Translation failed. Saving English lyrics only.");
        lyricsJa = "";
    }

    // 5. Save Lyrics
    const { error: lyricError } = await supabase
        .from('lyrics')
        .upsert({
            song_id: songId,
            content_en: lyricsEn,
            content_ja: lyricsJa,
            created_by: null // System
        }, { onConflict: 'song_id' });

    if (lyricError) {
        console.error("  Error saving lyrics:", lyricError);
        return false;
    } else {
        console.log("  Success! Saved lyrics.");
        return true;
    }
}

// --- Main Loop ---
async function main() {
    console.log("Starting Lyrics Collection (Discovery Mode)...");

    for (const artist of TARGET_ARTISTS) {
        console.log(`\nFetching candidates for: ${artist}`);
        const tracks = await fetchTopTracksLastFM(artist);

        let addedCount = 0;

        for (const track of tracks) {
            if (addedCount >= NEW_SONGS_PER_RUN_PER_ARTIST) {
                console.log(`  Target of ${NEW_SONGS_PER_RUN_PER_ARTIST} new songs reached for ${artist}. Moving to next.`);
                break;
            }

            const success = await processSong(track);

            if (success) {
                addedCount++;
                // Rate limiting sleep (15s for Gemini Free Tier Safety)
                console.log("  Sleeping 15s...");
                await new Promise(resolve => setTimeout(resolve, 15000));
            } else {
                // If skipped, no sleep needed (or very short)
                // await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        if (addedCount === 0) {
            console.log(`  No new songs found or added for ${artist} (checked ${tracks.length} candidates).`);
        }
    }

    console.log("\nBatch Complete.");
}

main().catch(console.error);
