import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sorteo de Partidos - Caracolí Verdolaga",
  description: "Sorteo de partidos de Atlético Nacional - Caracolí Verdolaga. Temporada 2026. El Rey de Copas, el Más Grande de Colombia.",
  keywords: ["Atlético Nacional", "Sorteo", "Fútbol", "Caracolí Verdolaga", "Partidos", "Colombia"],
  authors: [{ name: "Douglas Fugazi" }],
  icons: {
    icon: "/logos/Atletico_Nacional.jpg",
  },
  openGraph: {
    title: "Sorteo de Partidos - Caracolí Verdolaga",
    description: "Sorteo de partidos de Atlético Nacional - Temporada 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
