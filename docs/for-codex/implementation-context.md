# Implementation Context

## Completed Features (Phase 5)

- **Project Setup**: Next.js 14 App Router, Tailwind CSS, TypeScript.
- **Dependencies**: `@supabase/ssr`, `deepl-node`, `lucide-react`.
- **Database Schema**: `supabase/schema.sql` defined for Songs, Lyrics, Profiles, and RLS policies.
- **Auth**: Email/Password and Google Sign-in implemented (`/login`, `/auth/callback`).
- **Home Page**: iTunes Search integration (`src/lib/itunes.ts`).
- **Song View**: Split screen lyrics view (EN/JP). Logic to fallback to iTunes lookup if not in DB.
- **Add Lyrics**: Form to fetch metadata, input English lyrics, and auto-translate using DeepL API (`/api/translate`).
- **Middleware**: Session management for Supabase Auth.

## Verification Status

- `npm run build`: **PASSED**.
- Code quality: Basic ESLint checks passed.

## Pending Manual Setup (User Action Required)

1. **Supabase Project**: Create project and apply `supabase/schema.sql`.
2. **Environment Variables**: Populate `.env.local` with Supabase keys and DeepL API Key.
3. **DeepL Account**: Required for translation API.

## Known Limitations (V1)

- DeepL usage is rate-limited (5 req/min/IP).
- No admin moderation for lyrics (Community wiki style).
- Login required for submission, but email verification behavior depends on Supabase project settings.
