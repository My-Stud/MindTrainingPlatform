import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function GamesLayout({ children }) {
  const headersList = await headers();

  // The middleware sets 'x-embed-mode: 1' when ?embed=1 is in the URL.
  // This lets the admin panel's iframe preview load games without a
  // NextAuth session.  We also honour sec-fetch-dest as a fallback.
  const isEmbed = headersList.get("x-embed-mode") === "1";
  const isIframe = headersList.get("sec-fetch-dest") === "iframe";

  if (isEmbed || isIframe) {
    return children;
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return children;
}
