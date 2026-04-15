import type { Metadata } from "next";
import { Lora, Cormorant_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Festa Patronal — Colégio São José",
  description:
    "Inscreva sua família para a Festa Patronal do Colégio São José. 01 de maio de 2026 — Santa Missa, almoço, jogos e Grande Bingo.",
  metadataBase: new URL("https://festa.csj.edu.br"),
  openGraph: {
    title: "Festa Patronal — Colégio São José",
    description:
      "01 de maio de 2026. Santa Missa Solene às 10h, almoço, jogos e Grande Bingo. Inscreva sua família!",
    type: "website",
    locale: "pt_BR",
  },
  other: {
    "theme-color": "#1B2845",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${lora.variable} ${cormorantGaramond.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">{children}</body>
    </html>
  );
}
