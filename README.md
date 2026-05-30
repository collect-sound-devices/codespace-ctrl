# codespace-ctrl

Small Next.js/Vercel control panel for finding and starting GitHub Codespaces by `name` or `display_name`.

The browser never talks to GitHub directly. All GitHub calls happen in Vercel server functions and are protected by a shared secret sent in the POST request body.

## Current Scaffold

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- App Router
- `src/` directory
- Tailwind dependencies are present from the scaffold, but the app should stay visually simple unless we decide to use them deliberately.

Before changing Next.js routing or server function code, read the relevant local docs under:

```text
node_modules/next/dist/docs/
```

This project has an `AGENTS.md` warning because this Next.js version may differ from older conventions.

## Purpose

- Search the authenticated user's GitHub Codespaces by exact `name` or exact `display_name`.
- Show whether the codespace was found.
- Show the current running state.
- Start the matched codespace from a public POST endpoint when the shared secret is valid.
- Provide a compact UI with:
  - Header with app name and version.
  - Search field for codespace name or display name.
  - Secret string field.
  - Status area with found/running state, refresh button, readonly name, and readonly display name.

## Environment Variables

Use these locally in `.env.local` and in Vercel Environment Variables:

```text
GITHUB_PAT=github_pat_or_classic_token
CODESPACE_CTRL_SECRET=shared_post_secret
```

Do not expose either value with `NEXT_PUBLIC_`.

## Planned Structure

```text
src/
  app/
    api/
      codespaces/
        search/
          route.ts
        start/
          route.ts
    layout.tsx
    page.tsx
  components/
    Header.tsx
    CodespaceControlPanel.tsx
    CodespaceStatus.tsx
  server/
    githubCodespaces.ts
    requestAuth.ts
  services/
    codespaceClient.ts
  types/
    Codespace.ts
```

## Step 2 Implementation Plan

1. Read the local Next.js docs for App Router route handlers before writing API code.
2. Add shared domain types in `src/types/Codespace.ts`.
3. Add `src/server/requestAuth.ts` to parse JSON POST bodies and validate `key` against `CODESPACE_CTRL_SECRET`.
4. Add `src/server/githubCodespaces.ts` with two focused operations:
   - List the authenticated user's codespaces.
   - Start one codespace by real GitHub `name`.
5. Add `POST /api/codespaces/search`.
   - Body: `{ "key": "...", "query": "..." }`
   - Invalid secret: `401` or `403`.
   - Not found: `200` with `{ "found": false }`.
   - Found: `200` with minimal codespace metadata.
6. Add `POST /api/codespaces/start`.
   - Body: `{ "key": "...", "query": "..." }`
   - Validate secret first.
   - Find by exact `name` or `display_name`.
   - Call GitHub start endpoint using the real `name`.
   - Return the matched metadata and latest known state.
7. Add `src/services/codespaceClient.ts` so React components do not duplicate `fetch` logic.
8. Replace the default page with the actual tool UI:
   - Header.
   - Search input.
   - Password input for secret.
   - Search, Start, and Refresh controls.
   - Status panel.
9. Verify locally:
   - `npm run lint`
   - `npm run build`
   - `npm run dev`
   - Manual POST tests for wrong secret, missing query, not found, found, and start.

## API Contracts

### Search

```http
POST /api/codespaces/search
Content-Type: application/json
```

```json
{
  "key": "shared-secret",
  "query": "codespace-name-or-display-name"
}
```

Successful found response:

```json
{
  "found": true,
  "codespace": {
    "name": "codespace-name",
    "displayName": "Display Name",
    "state": "Available",
    "webUrl": "https://..."
  }
}
```

Successful not-found response:

```json
{
  "found": false
}
```

### Start

```http
POST /api/codespaces/start
Content-Type: application/json
```

```json
{
  "key": "shared-secret",
  "query": "codespace-name-or-display-name"
}
```

Successful response:

```json
{
  "started": true,
  "codespace": {
    "name": "codespace-name",
    "displayName": "Display Name",
    "state": "Starting",
    "webUrl": "https://..."
  }
}
```

## Design Constraints

- SOLID: keep GitHub API, request validation, browser API client, and UI components separated.
- KISS: two API routes, one GitHub service, one auth helper.
- YAGNI: no database, no auth provider, no fuzzy search, no global state library, no settings screen.
- Security: reject invalid shared secrets before making GitHub requests.
- Vercel: keep all secret-dependent code server-only.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```
