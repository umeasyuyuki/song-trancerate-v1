# Task Report: Favorite & Exist Song Pages

## 1. Test Strategy (Gate 1)

- **Scope**: Database queries and Page rendering.
- **Critical Paths**:
  - Filtering songs that effectively have lyrics (avoid empty song entries).
  - Correctly retrieving user-specific likes.
  - Search functionality responsive and accurate.

## 2. Red Phase (Failure Analysis)

- [ ] Verify queries fail or return empty before implementation/logic is correct.
- [ ] (Self-Correction) Ensure RLS policies allow viewing specific data.

## 3. Implementation Hints

- Reuse `SongCard` UI from Home page? (Maybe extract `SongCard` component).
- Use `!inner` join for `songs` -> `lyrics` to ensure existence.

## 4. Gate 2 Review

- [ ] Performance: Client-side filtering is okay for < 1000 songs. Pagination needed for scale? (MVP: No).
