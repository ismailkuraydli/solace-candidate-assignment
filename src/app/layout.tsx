import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-paper text-slate-900">
      <body className={`${inter.className}`}>
        <div>
          <div className="bg-primary">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 text-center text-sm text-white">
              Solace Advocates are covered by your Medicare
              plan!
            </div>
          </div>
          <main className="flex-1">
            <div>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
