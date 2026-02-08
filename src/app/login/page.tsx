"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/");
            router.refresh();
        }
        setLoading(false);
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Account created! Check your email to confirm.");
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-zinc-900">
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center">Login / Sign Up</h1>

                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{message}</div>}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded border dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Log In"}
                        </button>
                    </form>

                    <div className="mt-4 flex flex-col gap-3">
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full py-2 border border-gray-300 dark:border-zinc-600 rounded hover:bg-gray-50 dark:hover:bg-zinc-700 transition text-sm disabled:opacity-50"
                        >
                            Sign Up
                        </button>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-zinc-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-zinc-800 text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm disabled:opacity-50"
                        >
                            Google
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
