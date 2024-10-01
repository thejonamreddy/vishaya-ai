'use client'

import { useEffect, useState } from "react"
import { Course } from "../interfaces/course"
import { LoaderCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Language } from "../interfaces/language"
import Link from "next/link"

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
      const languagesData = await response[0].json()
      const coursesData = await response[1].json()
      setLanguages(languagesData)
      setCourses(coursesData)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Courses</h1>
      {loading ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="bg-white p-4 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Target Audience</TableHead>
                <TableHead>Learning Objectives</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Languages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(({ id, title, description, targetAudience, learningObjectives, level, duration, ...c }, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Link href={`/courses/${id}/topics`} className="text-muted-foreground underline">
                      {title}
                    </Link>
                  </TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{targetAudience}</TableCell>
                  <TableCell>{learningObjectives}</TableCell>
                  <TableCell>{level}</TableCell>
                  <TableCell>{duration}</TableCell>
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
      )
      }
    </div >
  )
}