import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://athena.heliannuuthus.com"),
  title: {
    default: "heliannuuthus",
    template: "%s | heliannuuthus"
  },
  description: "AI Infra Engineer & Vibe Coder — heliannuuthus's personal blog",
  icons: { icon: "/img/favicon.ico" },
  openGraph: {
    title: "heliannuuthus",
    description: "AI Infra Engineer & Vibe Coder — heliannuuthus's personal blog",
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
    <html lang="zh-Hans" data-scroll-behavior="smooth" suppressHydrationWarning>
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
