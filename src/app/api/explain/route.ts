import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    // 1. Auth Check
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!GEMINI_API_KEY) {
        return NextResponse.json({
            error: "API Key Missing",
            text: "AI解説機能を使用するには、環境変数 GEMINI_API_KEY を設定してください。(DeepLキーでは代用できません)"
        }, { status: 503 });
    }

    try {
        const { text, context } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Call Gemini API (using REST to avoid adding heavy SDK dependency if possible, or fetch)
        const prompt = `
    あなたは英語の先生です。以下の歌詞（または単語）について、文脈を踏まえた解説を日本語でしてください。
    
    対象のテキスト: "${text}"
    文脈（曲名/アーティスト/前後の歌詞）: ${context || "不明"}
    
    出力フォーマット:
    1. **意味**: 直訳ではない、文脈に合った意味
    2. **解説**: スラング、文化的背景、文法的なポイントなど（簡潔に）
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (response.status === 429) {
            return NextResponse.json({ error: "クレジットが不足しています。" }, { status: 429 });
        }

        if (!response.ok) {
            console.error("Gemini API Error Detail:", JSON.stringify(data, null, 2));
            return NextResponse.json({
                error: "Gemini API Error",
                details: data
            }, { status: response.status });
        }

        const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || "解説を生成できませんでした。";

        return NextResponse.json({ text: explanation });

    } catch (error: any) {
        console.error("AI API Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
