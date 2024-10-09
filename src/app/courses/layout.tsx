'use client'

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookAudio, Menu, SquarePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false)

  const NavMenu = (
    <div className="flex-1">
      <nav className="grid items-start px-3 text-sm font-medium">
        <Link href="/courses/new" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
          <SquarePlus className="h-4 w-4" />
          New Course
        </Link>
        <Link href="/courses" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-lg px-2 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
          <BookAudio className="h-4 w-4" />
          Courses
        </Link>
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[280px_1fr]">
      {/* Left */}
      <div className="border-r hidden lg:block">
        <div className="h-full max-h-screen flex flex-col gap-2">
          <div className="h-[60px] border-b p-4">
            <Link href="/" className="flex gap-2 font-semibold">
              <BookAudio className="h-6 w-6" />
              <span className="">Vishaya AI</span>
            </Link>
          </div>
          {NavMenu}
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col">
        <header className="h-[60px] border-b">
          <div className="flex gap-4 items-center px-4 h-full lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <Button variant="outline">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {NavMenu}
              </SheetContent>
            </Sheet>
            <span className="font-semibold">Vishaya AI</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 bg-muted">
          <div className="h-full lg:container lg:mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}