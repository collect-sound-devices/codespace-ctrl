import { findCodespaceByNameOrDisplayName } from "@/server/githubCodespaces";
import { parseAndAuthorizeCodespaceRequest } from "@/server/requestAuth";
import type { SearchCodespaceResponse } from "@/types/Codespace";

export async function POST(request: Request) {
  const authorized = await parseAndAuthorizeCodespaceRequest(request);

  if (!authorized.ok) {
    return Response.json(
      { error: authorized.message },
      { status: authorized.status },
    );
  }

  try {
    const codespace = await findCodespaceByNameOrDisplayName(
      authorized.body.query,
    );
    const response: SearchCodespaceResponse = codespace
      ? { found: true, codespace }
      : { found: false };

    return Response.json(response);
  } catch {
    return Response.json(
      { error: "Codespace search failed." },
      { status: 502 },
    );
  }
}

