# Codespace Ctrl

Codespace Ctrl is a small Next.js service for waking / stopping GitHub
Codespaces through HTTP endpoints. It is intended for developers who want a
simple service-to-service control API without putting a GitHub token in their
own client application.

The app is currently deployed on Vercel:

```text
https://codespace-ctrl.vercel.app
```

## Motivation

GitHub Codespaces can be stopped, unavailable, or slow to reach when another
tool expects them to be ready. This project exposes a minimal protected API that
can:

- find a Codespace by `name` or `display_name` (after trimming and
  lowercasing the lookup value);
- report the Codespace state, exact name and display name, and web URL;
- request a start;
- request a stop.

The GitHub personal access token (needs Codespace rights) stays on the Vercel as `GITHUB_PAT` secret. The caller
only send a secret value, that must match the Vercel secret `CODESPACE_CTRL_SECRET`, as `key` in the JSON body.

## API Contract

All endpoints are `POST` endpoints and accept the same JSON body:

```json
{
  "key": "post-secret",
  "query": "codespace-name-or-display-name"
}
```

`query` is matched against the GitHub Codespace `name` and `display_name`.
Matching is exact after `trim()` and lowercase normalization.

| Endpoint | Purpose |
| --- | --- |
| `/api/codespaces/search` | Looks up a Codespace and returns its current state. Use this as the status endpoint. |
| `/api/codespaces/start` | Looks up a Codespace and requests start if needed. |
| `/api/codespaces/stop` | Looks up a Codespace and requests stop if needed. |

### Details about Starting Codespace

```http
POST /api/codespaces/start
Content-Type: application/json
```

The endpoint returns `started: true` when a matching Codespace exists. If the
Codespace is already `Available` or `Starting`, the service does not call the
GitHub start API again and returns the current Codespace summary.

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

Response when not found:

```json
{
  "started": false,
  "found": false
}
```

Error payloads for invalid requests or upstream failures:

```json
{
  "error": "Secret key is invalid."
}
```

Important statuses:

- `400`: invalid JSON body or missing `query`;
- `401`: missing `key`;
- `403`: invalid `key`;
- `500`: server secret is not configured;
- `502`: GitHub Codespaces API request failed.

## Draft C# Example of Starting a Codespace by Name:

```csharp
var endpoint = "https://codespace-ctrl.vercel.app/api/codespaces/start";
var body = new
{
    key = Environment.GetEnvironmentVariable("CODESPACE_CTRL_SECRET"),
    query = "my-codespace"
};

using var http = new HttpClient();
using var response = await http.PostAsJsonAsync(endpoint, body);
var json = await response.Content.ReadAsStringAsync();

Console.WriteLine($"{(int)response.StatusCode} {json}");
response.EnsureSuccessStatusCode();
```

## GUI

The web UI is a test and demonstration client for the same API.
Inputs:

- Codespace name or display name;
- shared secret string.

The three icon buttons call search/status, start, and stop. The result panel
shows state, Codespace name, display name, and a short operation message.

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```text
GITHUB_PAT=github_pat_or_classic_token
CODESPACE_CTRL_SECRET=shared_post_secret
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

The production server also runs on `http://localhost:3000` by default.

## Vercel Deployment

The repository contains GitHub workflows for Vercel delivery:

- `.github/workflows/vercel-init.yml` (optional) initializes or refreshes production Vercel
  secret environment variables. It uses GitHub Actions secrets.
- `.github/workflows/deploy.yml` builds and deploys the app to Vercel.

Required GitHub Actions secrets:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## Governance

Qodana analysis is configured in `qodana.yaml` with the
`jetbrains/qodana-js:2025.3` linter and the inspection profile at
`.qodana/profiles/inspection-profile01.xml`.

## Changelog

- 2026.05 Initial Next.js App Router version with search, start, stop, and
  shared-secret protected API routes.
