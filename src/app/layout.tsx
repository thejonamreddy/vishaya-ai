import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link"
import {
  BookAudio,
  SquarePlus,
} from "lucide-react"
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vishaya AI",
  description: "Empowering Global Learning with AI-Generated Multilingual Courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen w-full grid grid-cols-[280px_1fr]">
          {/* Left */}
          <div className="border-r">
            <div className="h-full max-h-screen flex flex-col gap-2">
              <div className="h-[60px] border-b p-4">
                <Link href="/" className="flex gap-2 font-semibold">
                  <BookAudio className="h-6 w-6" />
                  <span className="">Vishaya AI</span>
                </Link>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-3 text-sm font-medium">
                  <Link href="/courses/new" className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                    <SquarePlus className="h-4 w-4" />
                    New Course
                  </Link>
                  <Link href="/courses" className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
                    <BookAudio className="h-4 w-4" />
                    Courses
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="flex flex-col">
            <header className="h-[60px] border-b">
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 bg-muted">
              <div className="h-full container mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
