import { NextResponse, type NextRequest } from "next/server";
import { signOut } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Clears a session whose user no longer exists in the database and sends the
 * visitor to the login page. Reachable from server renders and actions, where
 * directly mutating cookies is not permitted.
 */
export async function GET(request: NextRequest) {
  try {
    await signOut({ redirect: false });
  } catch {
    // Cookie may already be gone; the login redirect still applies.
  }
  return NextResponse.redirect(new URL("/login", request.url), {
    status: 307,
  });
}