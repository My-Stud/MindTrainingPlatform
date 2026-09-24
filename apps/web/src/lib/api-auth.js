import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function verifyApiAccess(request) {
  const apiKey = request.headers.get("x-api-key");

  if (apiKey && apiKey === process.env.API_KEY) {
    return { authorized: true, method: "api-key" };
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.role === "ADMIN") {
    return { authorized: true, method: "session", user: session.user };
  }

  return { authorized: false };
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}
