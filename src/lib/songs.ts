import { createClient } from "@/utils/supabase/server";

export async function getExistSongs() {
    const supabase = createClient();
    // Fetch songs that have at least one lyric entry
    // Using !inner to filter songs that don't have lyrics
    const { data, error } = await supabase
        .from("songs")
        .select("*, lyrics!inner(*)")
        .order("title");

    if (error) throw error;
    return data || [];
}

export async function getFavoriteSongs(userId: string) {
    const supabase = createClient();
    // Fetch likes for the user and join with songs
    const { data, error } = await supabase
        .from("likes")
        .select("created_at, songs(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;

    // Flatten the structure to return a list of songs
    return data?.map((like: any) => ({
        ...like.songs,
        liked_at: like.created_at
    })) || [];
}
