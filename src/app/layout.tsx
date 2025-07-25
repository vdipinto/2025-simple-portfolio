import type { Metadata } from "next";
import { Space_Grotesk, Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/sections/footer/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import ClientBreadcrumbs from "@/components/navigation/ClientBreadcrumbs";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vito Dipinto – Full Stack Developer",
  description:
    "Welcome to the portfolio of Vito Dipinto, a full stack developer showcasing personal projects, blog posts, and technical skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${publicSans.variable} antialiased`}
      >
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <ClientBreadcrumbs />
            <main>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
