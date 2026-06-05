import { GitHubCodespacesError } from "@/server/githubCodespaces";

export function codespacesApiErrorResponse(
  error: unknown,
  fallbackMessage: string,
): Response {
  if (error instanceof GitHubCodespacesError) {
    return Response.json(
      { error: error.message },
      { status: toPublicStatus(error.status) },
    );
  }

  return Response.json({ error: fallbackMessage }, { status: 502 });
}

function toPublicStatus(status: number): number {
  return status === 500 ? 500 : 502;
}
