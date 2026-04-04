import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SplashScreen } from '@/components/ui/splash-screen';

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400","600","700","800"], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: "Pinguis",
  description: "Los mejores productos digitales del mercado. Entrega inmediata, 100% seguro.",
  icons: {
    icon: "/pedro.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`overflow-x-hidden ${manrope.variable}`}>
      <body className={`${inter.className} m-0 p-0 overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]`}>
        <SplashScreen />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
