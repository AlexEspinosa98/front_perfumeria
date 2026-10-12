import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/nav/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import CartProvider from "@/components/CartProvider";
import WishlistProvider from "@/components/WishlistProvider";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bahía Perfumes | Especialistas en perfumería árabe",
  description: "Perfumería árabe, attar y oud. Haz tu pedido y confírmalo por WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${bodoniModa.variable} ${hankenGrotesk.variable} font-sans antialiased pb-16 md:pb-0`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                  <Navbar />
              {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
