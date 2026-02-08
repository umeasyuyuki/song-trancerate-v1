# Codex Response

- codex_mode: implementation-review
- task_type: review
- model: gpt-5.3-codex
- reasoning_effort: high
- sandbox: read-only
- source_commit: 0db2465
- worktree_state: dirty
- generated_at: 2026-02-08T15:40:38Z

**Scope**
I reviewed the current “recent changes” in the working tree (new `src/*`, `supabase/*`, and related config/docs), starting from `docs/for-codex/*` as requested.  
`npx tsc --noEmit --incremental false` passed, but `npm run lint` and `npm run build` could not run in this environment because the sandbox is read-only and Next.js needs to write under `.next`.

**Prioritized Findings**
1. **High: Translation API is effectively public and easy to abuse (cost/security risk).**  
   Evidence: `src/app/api/translate/route.ts:11`, `src/app/api/translate/route.ts:25`, `src/app/api/translate/route.ts:26`  
   Impact: Anyone can call `/api/translate` without auth, and IP-based limiting trusts `x-forwarded-for`, so DeepL quota can be burned.  
   Recommendation: Enforce server-side auth in the route (Supabase session check) and rate-limit by trusted identity (`user.id` + trusted IP) using a shared store (Redis/KV).  
   Trade-off: Requiring auth reduces anonymous convenience; shared limiter adds infra complexity.

2. **High: `songs` upsert likely conflicts with RLS policy (behavioral failure on existing songs).**  
   Evidence: `src/components/add-song-form.tsx:54`, `src/components/add-song-form.tsx:62`, `supabase/schema.sql:39`  
   Impact: `upsert` may require update permission on conflict, but `songs` only has insert policy; submission can fail once a song already exists.  
   Recommendation: Replace `upsert` with “select by `itunes_id` then insert if missing”, or add a tightly-scoped update policy for `songs`.  
   Trade-off: Select-then-insert adds one DB read; update policy broadens write surface if not constrained.

3. **Medium: `created_by` ownership can be forged or null (data integrity/security).**  
   Evidence: `supabase/schema.sql:48`, `supabase/schema.sql:60`, `src/components/add-song-form.tsx:75`  
   Impact: Client controls `created_by`; users can spoof ownership or create unowned rows.  
   Recommendation: Make `created_by` `not null default auth.uid()` and enforce `with check (auth.uid() = created_by)` in insert policy; stop sending `created_by` from client.  
   Trade-off: Requires migration/backfill for existing rows.

4. **Medium: Auth flow has broken routes (logout and OAuth error handling).**  
   Evidence: `src/components/navbar.tsx:19`, `src/app/auth/callback/route.ts:18`  
   Impact: Logout posts to missing `/auth/signout`; callback error redirects to missing `/auth/auth-code-error` page.  
   Recommendation: Implement these routes/pages or change UI/redirects to existing endpoints.

5. **Medium: Middleware runs Supabase user refresh on nearly every request (performance overhead).**  
   Evidence: `src/middleware.ts:57`, `src/middleware.ts:71`  
   Impact: Extra auth work on public pages and API routes increases latency and backend load.  
   Recommendation: Narrow matcher (exclude `/api`, static/assets) or only call `getUser()` where needed.  
   Trade-off: Narrowing matcher requires explicit auth checks on protected pages/routes.

6. **Medium: “Wiki-style” requirement is not implemented by schema/policies.**  
   Evidence: `supabase/schema.sql:51`, `supabase/schema.sql:63`, `docs/for-codex/plan-context.md:9`  
   Impact: One-lyrics-per-song plus “update own only” prevents collaborative editing promised in requirements.  
   Recommendation: Either align product docs to owner-only model, or redesign for collaborative/versioned edits (with moderation).

7. **Low: In-memory rate-limit map is unbounded and not reliable across instances.**  
   Evidence: `src/app/api/translate/route.ts:7`, `src/app/api/translate/route.ts:23`  
   Impact: Potential memory growth, and weak enforcement in serverless multi-instance deployments.  
   Recommendation: Periodic cleanup + bounded structure, or move to shared rate-limit backend.

8. **Low: Missing automated tests for critical paths.**  
   Evidence: no `*test*`/`*spec*` files under `src`  
   Impact: High chance of regressions in auth, RLS interaction, and submission flow.  
   Recommendation: Add at least:
   1. API tests for `/api/translate` auth + rate-limit behavior.
   2. Integration test for “existing song + lyrics insert”.
   3. E2E test for `search -> add -> view` success path.

**Open Questions**
1. Is anonymous access to `/api/translate` intentional, or should it be authenticated-only?  
2. Should lyrics editing be truly wiki-style (any authenticated user), or owner-only?
