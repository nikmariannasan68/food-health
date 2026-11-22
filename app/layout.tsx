import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Узнай, что ты ешь`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", locale: "ru_RU", siteName: SITE.name, title: `${SITE.name} — Узнай, что ты ешь`, description: SITE.description },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f6f8f7" }, { media: "(prefers-color-scheme: dark)", color: "#0c1311" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen">
        <a href="#main" className="skip-link">Перейти к содержанию</a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
