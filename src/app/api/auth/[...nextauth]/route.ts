import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";

type Handler = (req: NextRequest, ctx?: unknown) => Promise<Response>;

function describe(error: unknown): Record<string, string> {
  const e = error as {
    name?: string;
    message?: string;
    code?: unknown;
    cause?: unknown;
    stack?: string;
  } | null;
  const type = typeof error === "object" && error
    ? error.constructor?.name
    : typeof error;
  const name = e?.name ?? "";
  const message = typeof e?.message === "string"
    ? e.message
    : JSON.stringify(error) ?? String(error);
  const code = e?.code == null ? "" : String(e.code);
  const cause =
    e?.cause instanceof Error ? e.cause.message
    : typeof e?.cause === "string" ? e.cause
    : e?.cause != null ? JSON.stringify(e.cause)
    : "";
  const redact = (s: string) =>
    s
      .replace(/[a-zA-Z0-9+/=_\-]+@[a-zA-Z0-9.\-]+/g, "***@***")
      .replace(/eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/g, "[jwt]")
      .replace(/[A-Fa-f0-9]{64,}/g, "[long-hex]")
      .replace(/[A-Za-z0-9+/]{64,}={0,2}/g, "[opaque]");
  return {
    type: String(type),
    name,
    message: redact(message),
    code: redact(code),
    cause: redact(cause),
  };
}

function wrap(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      const diag = describe(error);
      console.error("[auth-diag] EXCEPTION", JSON.stringify(diag));
      return Response.json(
        { error: "temporary-server-diagnostic", diag },
        { status: 500 },
      );
    }
  };
}

export const GET = wrap(handlers.GET);
export const POST = wrap(handlers.POST);