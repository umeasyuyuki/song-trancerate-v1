import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import VocabSearchList from "@/components/vocab-search-list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function VocabularyPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: vocab } = await supabase
        .from("vocabularies")
        .select("*, songs(title, artist)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <span>📖</span> My Vocabulary
                    </h1>
                </div>

                <div className="bg-blue-50 dark:bg-zinc-800/30 p-6 rounded-2xl mb-8 border border-blue-100 dark:border-zinc-700">
                    <p className="text-lg">
                        You have saved <strong>{vocab?.length || 0}</strong> words.
                        Review them here to master the lyrics!
                    </p>
                </div>

                <VocabSearchList initialVocab={vocab || []} />
            </div>
        </main>
    );
}
