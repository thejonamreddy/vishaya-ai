'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileAudio, Globe, LayoutList, ImageIcon, FileText, Video, BookAudio } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [title, setTitle] = useState('')

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <BookAudio className="h-6 w-6 mr-2" />
          <span className="font-bold">Vishaya AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/courses/new">
            New Course
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/courses">
            Courses
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 hidden" href="#">
            Demo
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 hidden" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Create AI-Powered Courses in Minutes
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Generate comprehensive courses with AI-crafted content structure and multi-language audio lessons.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter a subject for your course" type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
                  <Link href={title ? `/courses/new?title=${title}` : '/courses/new'}>
                    <Button type="submit">Generate Course</Button>
                  </Link>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Experience the future of learning. Try our prototype now!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <LayoutList className="h-8 w-8 mb-2" />
                  <CardTitle>AI-Generated Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our AI analyzes your chosen subject and creates a comprehensive course structure with relevant sections and lessons.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileAudio className="h-8 w-8 mb-2" />
                  <CardTitle>Multi-Language Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate audio content for each lesson in English and other supported languages, enhancing accessibility.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 mb-2" />
                  <CardTitle>Global Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Break language barriers with AI-generated content available in multiple languages, making knowledge accessible worldwide.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Coming Soon: Enhanced Learning Experience
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We&apos;re constantly improving our AI to bring you more features. Here&apos;s what&apos;s on the horizon:
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <ImageIcon className="h-12 w-12" />
                  <h3 className="text-xl font-bold">AI-Generated Images</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Visualize concepts with custom illustrations</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-12 w-12" />
                  <h3 className="text-xl font-bold">Smart Lecture Notes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive notes for each lesson</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Video className="h-12 w-12" />
                  <h3 className="text-xl font-bold">AI Video Lectures</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engaging video content for visual learners</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Be Part of the Learning Revolution
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Be among the first to use AI in creating and consuming cutting-edge courses.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/courses/new">
                  <Button className="w-full" size="lg">
                    Start Creating Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">Made with ❤️ in India by <Link href="https://www.codewithjonam.com" target="_blank">@codewithjonam</Link></p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 hidden">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}