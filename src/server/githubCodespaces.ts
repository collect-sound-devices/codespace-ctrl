import type { CodespaceSummary } from "@/types/Codespace";

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_API_VERSION = "2026-03-10";
const CODESPACES_PAGE_SIZE = 100;

type GitHubCodespace = {
  name?: unknown;
  display_name?: unknown;
  state?: unknown;
  web_url?: unknown;
};

type GitHubCodespacesListResponse = {
  codespaces?: unknown;
};

export class GitHubCodespacesError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GitHubCodespacesError";
  }
}

export async function findCodespaceByNameOrDisplayName(
  query: string,
): Promise<CodespaceSummary | null> {
  const codespaces = await listCodespaces();
  const normalizedQuery = query.trim();

  return (
    codespaces.find(
      (codespace) =>
        codespace.name === normalizedQuery ||
        codespace.displayName === normalizedQuery,
    ) ?? null
  );
}

export async function startCodespace(
  codespaceName: string,
): Promise<CodespaceSummary> {
  const response = await githubFetch(
    `/user/codespaces/${encodeURIComponent(codespaceName)}/start`,
    {
      method: "POST",
    },
  );

  const payload = (await response.json()) as unknown;
  return toCodespaceSummary(payload);
}

async function listCodespaces(): Promise<CodespaceSummary[]> {
  const codespaces: CodespaceSummary[] = [];
  let page = 1;

  while (true) {
    const response = await githubFetch(
      `/user/codespaces?per_page=${CODESPACES_PAGE_SIZE}&page=${page}`,
    );
    const payload = (await response.json()) as GitHubCodespacesListResponse;
    const currentPage = Array.isArray(payload.codespaces)
      ? payload.codespaces.map(toCodespaceSummary)
      : [];

    codespaces.push(...currentPage);

    if (currentPage.length < CODESPACES_PAGE_SIZE) {
      return codespaces;
    }

    page += 1;
  }
}

async function githubFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = process.env.GITHUB_PAT;

  if (!token) {
    throw new GitHubCodespacesError("GitHub token is not configured.", 500);
  }

  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new GitHubCodespacesError(
      `GitHub Codespaces request failed with ${response.status}.`,
      response.status,
    );
  }

  return response;
}

function toCodespaceSummary(value: unknown): CodespaceSummary {
  if (!isGitHubCodespace(value)) {
    throw new GitHubCodespacesError("GitHub returned an invalid codespace.", 502);
  }

  return {
    name: value.name,
    displayName: value.display_name ?? value.name,
    state: value.state ?? "Unknown",
    webUrl: value.web_url,
  };
}

function isGitHubCodespace(value: unknown): value is {
  name: string;
  display_name?: string;
  state?: string;
  web_url?: string;
} {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const codespace = value as GitHubCodespace;

  return (
    typeof codespace.name === "string" &&
    (codespace.display_name === undefined ||
      typeof codespace.display_name === "string") &&
    (codespace.state === undefined || typeof codespace.state === "string") &&
    (codespace.web_url === undefined || typeof codespace.web_url === "string")
  );
}

