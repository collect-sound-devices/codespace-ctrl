import { timingSafeEqual } from "crypto";

export type CodespaceRequestBody = {
  key: string;
  query: string;
};

export type RequestAuthResult =
  | {
      ok: true;
      body: CodespaceRequestBody;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export async function parseAndAuthorizeCodespaceRequest(
  request: Request,
): Promise<RequestAuthResult> {
  const configuredSecret = process.env.CODESPACE_CTRL_SECRET;

  if (!configuredSecret) {
    return {
      ok: false,
      status: 500,
      message: "Server secret is not configured.",
    };
  }

  const body = await parseJsonBody(request);

  if (!isRecord(body)) {
    return {
      ok: false,
      status: 400,
      message: "Request body must be a JSON object.",
    };
  }

  const key = typeof body.key === "string" ? body.key : "";
  const query = typeof body.query === "string" ? body.query.trim() : "";

  if (!key) {
    return {
      ok: false,
      status: 401,
      message: "Secret key is required.",
    };
  }

  if (!isSameSecret(key, configuredSecret)) {
    return {
      ok: false,
      status: 403,
      message: "Secret key is invalid.",
    };
  }

  if (!query) {
    return {
      ok: false,
      status: 400,
      message: "Codespace name or display name is required.",
    };
  }

  return {
    ok: true,
    body: {
      key,
      query,
    },
  };
}

async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSameSecret(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

