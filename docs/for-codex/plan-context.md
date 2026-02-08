# Plan Context

## User Requirements

- **Goal**: Web app for English learners to view English lyrics and Japanese translations side-by-side.
- **Target**: English learners, Western music listeners.
- **Key Features**:
  - Song Search (Artist/Title).
  - Lyric Display (Split view: EN / JP).
  - **User Submission (Wiki-style)**: Users can add songs if not found.
  - **DeepL Integration**: Auto-translate English lyrics during submission.
  - **Authentication**: Google Login (via Supabase) required for posting.
- **Constraints**:
  - **Operation Cost**: 0 Yen (Strict).
  - **Stack**: Vercel (Frontend/API), Supabase (DB/Auth), DeepL Free API, iTunes Search API (or Spotify).
- **Success Criteria**:
  - Functional test with 3 specific songs: "Sicko Mode", "FE!N", "All of the Lights".
  - User flow: Search -> Not Found -> Add -> Input Info -> Auto-Translate -> Save -> View.

## Architecture Decisions

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS (shadcn/ui if possible).
- **Backend/DB**: Supabase (PostgreSQL + Auth).
- **External APIs**:
  - **DeepL API Free**: For translation (limit checking required).
  - **iTunes Search API**: For fetching artist/track metadata (no auth required, easier than Spotify for 0 yen/simple setup).

## Risks & Considerations

- **Copyright**: Lyrics are copyrighted. For personal/educational MVP, we proceed, but this is a risk for a public app. *Note: User is aware this is a personal project.*
- **DeepL Limits**: Free tier has character limits (500,000 chars/month). Should cache translations in DB.
