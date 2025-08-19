import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/sections/footer/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import ClientBreadcrumbs from "@/components/navigation/ClientBreadcrumbs";
import { SITE_URL } from "@/lib/site";
import { spaceGrotesk, publicSans } from "./fonts";  // ← use centralized fonts

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vito Dipinto – Full Stack Developer",
  description:
    "Welcome to the portfolio of Vito Dipinto, a full stack developer showcasing personal projects, blog posts, and technical skills.",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
  appleWebApp: { title: "Vito Dipinto" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${publicSans.variable} ${spaceGrotesk.variable} antialiased`}>
        <SessionWrapper>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <ClientBreadcrumbs />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
