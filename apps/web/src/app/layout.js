import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutShell from "@/components/LayoutShell";
import { Suspense } from "react";

export const metadata = {
  title: "VieBrain | Mind Training",
  description: "Train your brain with scientifically designed exercises.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <Providers>
          <Suspense fallback={<main className="pt-20 flex-grow">{children}</main>}>
            <LayoutShell>
              {children}
            </LayoutShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
