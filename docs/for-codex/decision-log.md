# Decision Log

## Architecture Decisions

- **Frontend Framework**: Next.js 14 (App Router) selected for Vercel integration and modern React features.
- **Database**: Supabase (PostgreSQL) selected for 0-yen tier and built-in Auth.
- **Music Metadata Source**: iTunes Search API selected over Spotify because it requires no authentication (simplifies 0-yen architecture).
- **Translation Engine**: DeepL API Free selected for quality. Free tier limit (500k chars) is sufficient for MVP.
- **Translation Strategy**: Translations will be performed on user request (Click-to-Translate) and stored in DB to minimize API usage. **[Decision: Explicit User Action]**
- **Security & Cost**:
  - Rate limiting enforced on API route.
  - Character count check before API call.
  - No auto-translation on page load.

## Schema Design (Draft)

- **Songs Table**:
  - `id` (UUID)
  - `itunes_id` (String, unique)
  - `title`
  - `artist`
  - `album_art_url`
  - `preview_url`
- **Lyrics Table**:
  - `id` (UUID)
  - `song_id` (FK)
  - `content_en` (Text)
  - `content_ja` (Text)
  - `created_by` (User ID)

## Open Questions

- Need to verify if iTunes API covers all target genres (Hip-hop coverage is generally good).
