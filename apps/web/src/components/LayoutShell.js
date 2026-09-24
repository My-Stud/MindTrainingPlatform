"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

/**
 * Conditionally renders Navigation and Footer.
 * Hidden on /admin pages and when ?embed=1 is in the URL (for iframe game previews).
 */
export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdmin = pathname?.startsWith("/admin");
  const isEmbed = searchParams?.get("embed") === "1";
  const hideChrome = isAdmin || isEmbed;
  const isGame = pathname?.startsWith("/games/") && pathname !== "/games";

  return (
    <>
      {!hideChrome && <Navigation />}
      <main className={hideChrome ? "flex-grow" : "pt-20 flex-grow"}>
        {children}
      </main>
      {!hideChrome && !isGame && <Footer />}
    </>
  );
}
