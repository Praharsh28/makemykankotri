import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Playfair_Display } from "next/font/google";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-heading-alt",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "WebKankotri - AI-Powered Wedding Invitations",
  description: "Create beautiful, animated wedding invitations with AI. Design, customize, and share your perfect invitation in minutes.",
  keywords: ["wedding invitations", "AI design", "template builder", "animations"],
  authors: [{ name: "WebKankotri Team" }],
  openGraph: {
    title: "WebKankotri - AI-Powered Wedding Invitations",
    description: "Create beautiful, animated wedding invitations with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${playfair.variable} antialiased`}
      >
        <PerformanceMonitor />
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
