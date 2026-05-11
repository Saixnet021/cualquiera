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
    default: "ECOMMERCE",
    template: "%s | ECOMMERCE"
  },
  description: "Plataforma de comercio electrónico industrial.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
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
