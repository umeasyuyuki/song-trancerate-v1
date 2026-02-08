import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import * as deepl from "deepl-node";

// Simple in-memory rate limiter (For MVP - production would use Redis/KV)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

export async function POST(req: Request) {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const timestamps = requestLog.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

    if (validTimestamps.length >= MAX_REQUESTS) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a minute." },
            { status: 429 }
        );
    }

    requestLog.set(ip, [...validTimestamps, now]);

    // 2. Auth Check
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { text, targetLang = "ja" } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid text" }, { status: 400 });
        }

        // Cost Control: Limit character count
        if (text.length > 5000) {
            return NextResponse.json({ error: "Text too long (max 5000 chars)" }, { status: 400 });
        }

        const authKey = process.env.DEEPL_API_KEY;
        if (!authKey) {
            return NextResponse.json({ error: "DeepL API Key not configured" }, { status: 500 });
        }

        const translator = new deepl.Translator(authKey);
        const result = await translator.translateText(text, null, targetLang as deepl.TargetLanguageCode);

        return NextResponse.json({
            text: result.text,
            detectedSourceLang: result.detectedSourceLang
        });

    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }
}
