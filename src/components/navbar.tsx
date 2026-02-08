import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="border-b p-4 bg-white dark:bg-zinc-950">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Song Trancerate 🎧
                </Link>

                <div className="flex gap-4 items-center">
                    {user ? (
                        <div className="flex gap-4 items-center">
                            <span className="text-sm text-gray-600">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button type="submit" className="text-sm hover:underline">
                                    Logout
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
