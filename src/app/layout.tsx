import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const mori = localFont({
  src: [
    { path: "../fonts/PPMori-Extralight.woff2", weight: "200" },
    { path: "../fonts/PPMori-Book.woff2", weight: "400" },
    { path: "../fonts/PPMori-Regular.woff2", weight: "500" },
    { path: "../fonts/PPMori-SemiBold.woff2", weight: "600" },
    { path: "../fonts/PPMori-ExtraBold.woff2", weight: "800" },
  ],
  variable: "--font-primary",
  display: "swap",
});

const modelMono = localFont({
  src: [
    { path: "../fonts/PPModelMono-Light.woff2", weight: "300" },
    { path: "../fonts/PPModelMono-Book.woff2", weight: "400" },
    { path: "../fonts/PPModelMono-Medium.woff2", weight: "500" },
    { path: "../fonts/PPModelMono-Bold.woff2", weight: "700" },
  ],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Get Shit Pretty",
  description:
    "Design engineering system for AI coding agents. Brand identity + design projects, from strategy to code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(mori.variable, modelMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
