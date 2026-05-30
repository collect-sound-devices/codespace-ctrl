# Codespace Ctrl

Small GitHub Codespaces control panel using Next.js / React / TypeScript.

The app searches the authenticated user's GitHub Codespaces by `name` or
`display_name` and can start or stop a matched codespace. The browser never calls
GitHub directly. GitHub API access stays inside Next.js server route handlers.

## Motivation

*Codespace Ctrl* provides a small public control surface for GitHub Codespaces
without exposing the GitHub token to the browser.

It is intended for cases where a known shared secret is enough protection and a
full user login flow would be unnecessary.

## Functions

- Search: finds a codespace by exact `name` or exact `display_name`.
- Status: shows whether the codespace was found and displays its current state.
- Start: starts the matched codespace when it is not already running.
- Stop: stops the matched codespace when it is not already stopped.
- UI: provides one search field, one secret field, icon buttons, and readonly
  status details.
- Server protection: every Codespaces API route requires a valid shared secret
  in the POST request body.

## Web Hosting (Primary Use Case)

### Client

- *Codespace Ctrl* is designed for Vercel deployment.
- The UI is served by Next.js and runs in the browser.
- The UI sends POST requests only to this app's own API routes.

### Server Functions

- Next.js route handlers run as Vercel server functions.
- Server functions call the GitHub Codespaces REST API with `GITHUB_PAT`.
- Server functions reject invalid shared secrets before calling GitHub.

## Environment Variables

Configure these variables locally in `.env.local` and in Vercel Environment
Variables:

```text
GITHUB_PAT=github_pat_or_classic_token
CODESPACE_CTRL_SECRET=shared_post_secret
```

Do not expose either value with `NEXT_PUBLIC_`.

`GITHUB_PAT` must belong to the GitHub account that owns the target codespaces
and must be allowed to manage Codespaces.

## API

All API endpoints accept POST requests with this body:

```json
{
  "key": "shared-post-secret",
  "query": "codespace-name-or-display-name"
}
```

### Search Codespace

```http
POST /api/codespaces/search
Content-Type: application/json
```

Found response:

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

Not found response:

```json
{
  "found": false
}
```

### Start Codespace

```http
POST /api/codespaces/start
Content-Type: application/json
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

### Stop Codespace

```http
POST /api/codespaces/stop
Content-Type: application/json
```

Successful response:

```json
{
  "stopped": true,
  "codespace": {
    "name": "codespace-name",
    "displayName": "Display Name",
    "state": "ShuttingDown",
    "webUrl": "https://..."
  }
}
```

## Development Environment

### Start locally (development mode)

**Step 1. Install dependencies:**

```bash
npm install
```

**Step 2. Configure local secrets:**

Create `.env.local`:

```text
GITHUB_PAT=github_pat_or_classic_token
CODESPACE_CTRL_SECRET=shared_post_secret
```

**Step 3. Start the development server:**

```bash
npm run dev
```

**Step 4. Open the app:**

```text
http://localhost:3000
```

## Local Deployment (Production Mode)

**Step 1. Build the app:**

```bash
npm run build
```

**Step 2. Start the production server:**

```bash
npm start
```

**Step 3. Open the app:**

```text
http://localhost:3000
```

## Project Structure

```text
src/
  app/
    api/codespaces/search/route.ts
    api/codespaces/start/route.ts
    api/codespaces/stop/route.ts
    layout.tsx
    page.tsx
  components/
    CodespaceControlPanel.tsx
    CodespaceStatus.tsx
    Header.tsx
  server/
    githubCodespaces.ts
    requestAuth.ts
  services/
    codespaceClient.ts
  types/
    Codespace.ts
```

## Design Principles

- KISS: one small page, three POST endpoints, one GitHub service.
- YAGNI: no database, no user accounts, no settings screen, no background jobs.
- Server-only secrets: GitHub and shared-secret values stay outside browser code.
- Small modules: request validation, GitHub access, browser fetch calls, and UI
  rendering are kept separate.

## Governance (Qodana)

Local Qodana analysis is configured in `qodana.yaml` to use
`jetbrains/qodana-js:2025.3`.

## Vercel Deployment

Set these Vercel Environment Variables before deploying:

- `GITHUB_PAT`
- `CODESPACE_CTRL_SECRET`

Then deploy the Next.js app as a standard Vercel project.

## Changelog

- 2026.05 Initial Next.js App Router version with search, start, stop, and a
  small shared-secret protected UI.
