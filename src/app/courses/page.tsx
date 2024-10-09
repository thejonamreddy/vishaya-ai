'use client'

import { useEffect, useState } from "react"
import { Course } from "../interfaces/course"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Language } from "../interfaces/language"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showError, showResponseError } from "../utils/error.util"

export default function Courses() {
  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<Language[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  async function loadData() {
    try {
      setLoading(true)
      const languagesPromise = fetch('/api/language')
      const coursesPromise = fetch('/api/course')
      const response = await Promise.all([languagesPromise, coursesPromise])
      if (response.some((r) => !r.ok)) { return showResponseError(response) }
      const languagesData = await response[0].json()
      const coursesData = await response[1].json()
      setLanguages(languagesData)
      setCourses(coursesData)
    } catch (error) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function Status(status: string) {
    if (status === 'draft') {
      return <span className="text-orange-500">Draft</span>
    } else if (status === 'brainstorming') {
      return <span className="text-purple-500">Brainstorming</span>
    } else if (status === 'prototyping') {
      return <span className="text-blue-500">Prototyping</span>
    } else if (status === 'ready') {
      return <span className="text-green-500">Ready</span>
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Courses</h1>
      {loading ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <>
          <div className="lg:hidden">
            {!courses.length ? (
              <div className="bg-white p-4 border rounded-md">
                No data to display
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {courses.map(({ id, title, description, ...c }) => (
                  <Link key={id} href={`/courses/${id}/details`}>
                    <Card className="shadow-none h-full">
                      <CardHeader>
                        <CardTitle className="flex gap-4">
                          <span className="flex-1">{title}</span>
                          <ArrowRight className="w-4 h-4" />
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4">
                          {c.languages.map(({ languageId }, j) => (
                            <Badge key={j}>{languages.find((l) => l.id === languageId)?.name}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-4 border rounded-md hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Learning Objectives</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Languages</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map(({ id, title, description, targetAudience, learningObjectives, level, duration, status, ...c }, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Link href={`/courses/${id}/details`} className="text-muted-foreground underline">
                        {title}
                      </Link>
                    </TableCell>
                    <TableCell>{description}</TableCell>
                    <TableCell>{targetAudience}</TableCell>
                    <TableCell>{learningObjectives}</TableCell>
                    <TableCell>{level}</TableCell>
                    <TableCell>{duration}</TableCell>
                    <TableCell>{Status(status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        {c.languages.map(({ languageId }, j) => (
                          <Badge key={j}>{languages.find((l) => l.id === languageId)?.name}</Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!courses.length && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground"> No data to display</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table >
          </div>
        </>
      )
      }
    </div >
  )
}