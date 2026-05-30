import type {
  SearchCodespaceResponse,
  StartCodespaceResponse,
  StopCodespaceResponse,
} from "@/types/Codespace";

type CodespaceRequest = {
  key: string;
  query: string;
};

export function searchCodespace(
  request: CodespaceRequest,
): Promise<SearchCodespaceResponse> {
  return postCodespaceRequest("/api/codespaces/search", request);
}

export function startCodespace(
  request: CodespaceRequest,
): Promise<StartCodespaceResponse> {
  return postCodespaceRequest("/api/codespaces/start", request);
}

export function stopCodespace(
  request: CodespaceRequest,
): Promise<StopCodespaceResponse> {
  return postCodespaceRequest("/api/codespaces/stop", request);
}

async function postCodespaceRequest<TResponse>(
  path: string,
  body: CodespaceRequest,
): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | { error?: unknown }
    | TResponse
    | null;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Request failed.";

    throw new Error(message);
  }

  return payload as TResponse;
}
