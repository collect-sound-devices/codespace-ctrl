import {
  findCodespaceByNameOrDisplayName,
  startCodespace,
} from "@/server/githubCodespaces";
import { parseAndAuthorizeCodespaceRequest } from "@/server/requestAuth";
import type { StartCodespaceResponse } from "@/types/Codespace";

const RUNNING_STATES = new Set(["Available", "Starting"]);

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
      const response: StartCodespaceResponse = {
        started: false,
        found: false,
      };

      return Response.json(response);
    }

    const codespace = RUNNING_STATES.has(matchedCodespace.state)
      ? matchedCodespace
      : await startCodespace(matchedCodespace.name);
    const response: StartCodespaceResponse = {
      started: true,
      codespace,
    };

    return Response.json(response);
  } catch {
    return Response.json(
      { error: "Codespace start failed." },
      { status: 502 },
    );
  }
}

