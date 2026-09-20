import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/vanoria/store";

export const metadata: Metadata = {
  title: "Vanoria | An Artisanal Chocolate House",
  description: "Six flavours. A sweeter tomorrow. Discover Vanoria chocolates and thoughtful, personalised gifts.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
