import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/nav/Navbar";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FRAGANCE | The Art of Rare Scent",
  description:
    "Perfumería artesanal. Fragancias de alta calidad crafted with the rarest botanical essences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${bodoniModa.variable} ${hankenGrotesk.variable} font-sans antialiased`}
      >
        <div className="grain-overlay" aria-hidden="true" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
