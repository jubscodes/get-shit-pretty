import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const neueMontreal = localFont({
  src: [
    { path: "../fonts/PPNeueMontreal-Light.woff2", weight: "300" },
    { path: "../fonts/PPNeueMontreal-Regular.woff2", weight: "400" },
    { path: "../fonts/PPNeueMontreal-Medium.woff2", weight: "500" },
    { path: "../fonts/PPNeueMontreal-Bold.woff2", weight: "700" },
  ],
  variable: "--font-primary",
  display: "swap",
});

const neueMontrealMono = localFont({
  src: [
    { path: "../fonts/PPNeueMontrealMono-Regular.woff2", weight: "400" },
    { path: "../fonts/PPNeueMontrealMono-Medium.woff2", weight: "500" },
    { path: "../fonts/PPNeueMontrealMono-Bold.woff2", weight: "700" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const monumentExtended = localFont({
  src: [
    { path: "../fonts/PPMonumentExtended-Light.woff2", weight: "300" },
    { path: "../fonts/PPMonumentExtended-Regular.woff2", weight: "400" },
    { path: "../fonts/PPMonumentExtended-Bold.woff2", weight: "700" },
    { path: "../fonts/PPMonumentExtended-Black.woff2", weight: "900" },
  ],
  variable: "--font-display",
  display: "swap",
});

const playground = localFont({
  src: "../fonts/PPPlayground-Regular.woff2",
  variable: "--font-accent",
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
      className={cn(
        neueMontreal.variable,
        neueMontrealMono.variable,
        monumentExtended.variable,
        playground.variable,
      )}
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
