import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nurtura AI — Know my next step",
    template: "%s · Nurtura AI",
  },
  description:
    "From 'I need a doctor' to 'I know my next step.' A patient-focused assistive maternal & child healthcare care-journey companion.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Nurtura AI", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#1a2b4a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
