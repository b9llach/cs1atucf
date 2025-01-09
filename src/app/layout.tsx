import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "i hate cs1",
  description: "i hate cs1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 py-2 px-4 bg-black/50 backdrop-blur-sm">
            <p className="text-center text-zinc-400 text-sm">
              made by <a href="https://github.com/b9llach" className="hover:text-white transition-colors">billy bellach | @b9llach</a>
            </p>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
