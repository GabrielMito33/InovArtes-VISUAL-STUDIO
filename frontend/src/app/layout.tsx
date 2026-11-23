import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Visual Studio",
  description: "Ferramentas de inteligência artificial para comunicação visual.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
