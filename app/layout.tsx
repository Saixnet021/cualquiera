import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from '@/src/presentation/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: '--font-manrope'
});

export const metadata: Metadata = {
  title: {
    default: "ECOMMERCE — Premium Store Demo",
    template: "%s | ECOMMERCE"
  },
  description: "Una plataforma de comercio electrónico moderna, rápida y escalable. Demo profesional para clientes.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ECOMMERCE — Premium Store Demo",
    description: "Una plataforma de comercio electrónico moderna, rápida y escalable. Demo profesional para clientes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`overflow-x-hidden ${manrope.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} m-0 p-0 overflow-x-hidden bg-bg text-fg`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}

            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg)',
                  color: 'var(--fg)',
                  border: '1px solid var(--border)',
                  borderRadius: '0px',
                  fontSize: '12px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                },
                success: {
                  iconTheme: { primary: 'var(--fg)', secondary: 'var(--bg)' },
                },
                error: {
                  iconTheme: { primary: 'var(--fg)', secondary: 'var(--bg)' },
                },
              }}
            />
          </AuthProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
