# Codespace Ctrl

Controls GitHub Codespaces from a small Next.js / React / TypeScript app.<br>
The browser talks only to this app. GitHub API calls stay inside Next.js server
route handlers.

## Motivation

*Codespace Ctrl* provides a simple control surface for starting, stopping, and
checking a GitHub Codespace.

It is built for the narrow case where a shared secret is enough access control
and a full user login flow would add more system than the job needs.

## Functions

- Lookup: finds one codespace by exact `name` or exact `display_name`
  comparison after trimming and lowercasing.
- Status: shows whether the codespace was found and displays its current state.
- Start: starts the matched codespace unless it is already `Available` or
  `Starting`.
- Stop: stops the matched codespace unless it is already `Shutdown`,
  `Archived`, or `Deleted`.
- Protection: requires the configured shared secret on every API request.
- Secret handling: keeps `GITHUB_PAT` and `CODESPACE_CTRL_SECRET` server-side.

## Web Hosting (Primary Use Case)

- The *Codespace Ctrl* is deployed on Vercel at https://list-audio-react-app.vercel.app.

## API

### Search Codespace

```http
POST /api/codespaces/search
Content-Type: application/json
```

Possible response:

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

### Start Codespace

```http
POST /api/codespaces/start
Content-Type: application/json
```

Response when found:

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

Possible response

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

### Start the app locally (development mode)

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

**Step 3. Start the npm development server:**

```bash
npm run dev
```

**Step 4. Open a browser at http://localhost:3000**

## Local Deployment (Production Mode)

**Step 1. Build the app for production:**

```bash
npm run build
```

**Step 2. Start the npm production server:**

```bash
npm start
```

**Step 3. Open a browser at http://localhost:3000**

## Governance (Qodana)

Local Qodana analysis is configured in `qodana.yaml` to use the
`jetbrains/qodana-js:2025.3` linter together with the custom inspection profile
at `.qodana/profiles/inspection-profile01.xml`.
It explicitly checks `CyclomaticComplexityJS` and excludes non-source files such
as `README.md`.

## Vercel Deployment

- Run `.github/workflows/vercel-init.yml` once for a new Vercel project or when
  rotating secrets. `GITHUB_PAT` and `CODESPACE_CTRL_SECRET` secrets configured as
  server-side environment variables.
- Regular production deployments use `.github/workflows/deploy.yml`.
- The workflows use the following GitHub Actions secrets: `VERCEL_TOKEN`,
  `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `UNIVERSAL_PAT`, and
  `CODESPACE_CTRL_SECRET`.

## Changelog

- 2026.05 Initial Next.js App Router version with search, start, stop, and
  shared-secret protected API routes.
