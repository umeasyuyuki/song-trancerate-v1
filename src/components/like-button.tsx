"use client";

import { createClient } from "@/utils/supabase/client";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
    songId: string;
    userId?: string;
    initialIsLiked: boolean;
    initialCount: number;
}

export default function LikeButton({ songId, userId, initialIsLiked, initialCount }: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const toggleLike = async () => {
        if (!userId) {
            router.push("/login");
            return;
        }
        if (loading) return;

        setLoading(true);
        // Optimistic update
        const nextIsLiked = !isLiked;
        setIsLiked(nextIsLiked);
        setCount((prev) => (nextIsLiked ? prev + 1 : prev - 1));

        try {
            if (nextIsLiked) {
                const { error } = await supabase
                    .from("likes")
                    .insert({ user_id: userId, song_id: songId });
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .match({ user_id: userId, song_id: songId });
                if (error) throw error;
            }

            router.refresh();
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert optimistic update
            setIsLiked(!nextIsLiked);
            setCount((prev) => (nextIsLiked ? prev - 1 : prev + 1));
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleLike}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${isLiked
                    ? "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400"
                }`}
        >
            <Heart
                size={20}
                fill={isLiked ? "currentColor" : "none"}
                className={loading ? "opacity-50" : ""}
            />
            <span className="font-semibold">{count}</span>
        </button>
    );
}
