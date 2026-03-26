import GlassFooter from "@/components/layout/glass-footer";
import GlassNavbar from "@/components/layout/glass-navbar";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "heliannuuthus",
    template: "%s | heliannuuthus"
  },
  description: "heliannuuthus's personal blog",
  icons: { icon: "/img/favicon.ico" },
  openGraph: {
    title: "heliannuuthus",
    description: "heliannuuthus's personal blog",
    url: "https://athena.heliannuuthus.com",
    siteName: "heliannuuthus",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@callmebill/lxgw-wenkai-web@latest/style.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-[#f5f5f7] dark:bg-[#1d1d1f] transition-colors duration-300">
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <GlassNavbar />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
              {children}
            </main>
            <GlassFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
