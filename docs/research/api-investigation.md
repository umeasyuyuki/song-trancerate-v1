# Research: API & Technology Stack

## 1. Music Metadata: iTunes Search API

- **Endpoint**: `https://itunes.apple.com/search`
- **Auth**: None required (Public).
- **Cost**: Free.
- **Key Parameters**:
  - `term`: Search query (URL encoded).
  - `media`: `music`.
  - `entity`: `song`.
  - `country`: `JP` (to get Japanese metadata if available, or `US`).
- **Response**: JSON containing artist name, track name, album art, preview URL.
- **Suitability**: Perfect for 0-yen MVP. No rate limit specified but should be reasonable.

## 2. Translation: DeepL API Free

- **Endpoint**: `https://api-free.deepl.com/v2/translate`
- **Auth**: `DeepL-Auth-Key` in header.
- **Cost**: Free (up to 500,000 chars/month).
- **Limits**:
  - Max body size: 128 KiB.
  - No daily limit, just monthly.
- **Library**: `deepl-node` (Official).
- **Strategy**: Cache translations in Supabase to save character usage.

## 3. Backend & Auth: Supabase

- **Database**: PostgreSQL (Free Tier: 500MB storage).
- **Auth**:
  - Google OAuth (Free).
  - Row Level Security (RLS) to protect user data.
- **Library**: `@supabase/ssr` for Next.js App Router integration.

## 4. Frontend: Next.js + Shadcn UI

- **Framework**: Next.js 14 (App Router).
- **Hosting**: Vercel (Free Tier).
- **UI**: Shadcn UI (Radix Primitives + Tailwind) - Copy/paste components, no extra dependency weight.
