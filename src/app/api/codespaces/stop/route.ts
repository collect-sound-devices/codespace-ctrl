import {
  findCodespaceByNameOrDisplayName,
  stopCodespace,
} from "@/server/githubCodespaces";
import { codespacesApiErrorResponse } from "@/server/codespacesApiError";
import { parseAndAuthorizeCodespaceRequest } from "@/server/requestAuth";
import type { StopCodespaceResponse } from "@/types/Codespace";

const STOPPED_STATES = new Set(["Shutdown", "Archived", "Deleted"]);

export async function POST(request: Request) {
  const authorized = await parseAndAuthorizeCodespaceRequest(request);

  if (!authorized.ok) {
    return Response.json(
      { error: authorized.message },
      { status: authorized.status },
    );
  }

  try {
    const matchedCodespace = await findCodespaceByNameOrDisplayName(
      authorized.body.query,
    );

    if (!matchedCodespace) {
      const response: StopCodespaceResponse = {
        stopped: false,
        found: false,
      };

      return Response.json(response);
    }

    const codespace = STOPPED_STATES.has(matchedCodespace.state)
      ? matchedCodespace
      : await stopCodespace(matchedCodespace.name);
    const response: StopCodespaceResponse = {
      stopped: true,
      codespace,
    };

    return Response.json(response);
  } catch (error) {
    return codespacesApiErrorResponse(error, "Codespace stop failed.");
  }
}
