import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { SessionProviderWrapper } from "@/components/layout/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trivela - FIFA World Cup 2026 Prediction Contest",
  description: "Predict FIFA World Cup 2026 match results and compete on the leaderboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-blue-deep text-white">
        <SessionProviderWrapper>
          <Navbar />
          <main className="min-h-screen bg-blue-deep">
            {children}
          </main>
          <footer className="border-t border-blue-border bg-blue-dark py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-blue-border text-sm font-heading">
              © 2026 Trivela • COLLEGE UNION MEC
            </div>
          </footer>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
