'use client'

import { CSSProperties, useEffect, useState } from "react"
import { Course } from "../interfaces/course"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Language } from "../interfaces/language"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Courses() {
  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<Language[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [initialRender, setInitialRender] = useState(true)

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  async function loadData() {
    try {
      setLoading(true)
      const languagesPromise = fetch('/api/language')
      const coursesPromise = fetch(`/api/course?page=${page}&pageSize=${itemsPerPage}`)
      const response = await Promise.all([languagesPromise, coursesPromise])
      const languagesData = await response[0].json()
      const coursesData = await response[1].json()
      setLanguages(languagesData)
      setTotalCount(coursesData.totalCount)
      setCourses(coursesData.list)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function loadCourses() {
    try {
      setLoading(true)
      const response = await fetch(`/api/course?page=${page}&pageSize=${itemsPerPage}`)
      const data = await response.json()
      setTotalCount(data.totalCount)
      setCourses(data.list)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false)
      return
    }
    loadCourses()
  }, [page, itemsPerPage])

  const prev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  const next = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  const prevStyle = {
    cursor: page === 1 ? 'not-allowed' : 'pointer',
    pointerEvents: page === 1 ? 'none' : 'auto',
    opacity: page === 1 ? 0.5 : 1
  } as CSSProperties

  const nextStyle = {
    cursor: page === totalPages ? 'not-allowed' : 'pointer',
    pointerEvents: page === totalPages ? 'none' : 'auto',
    opacity: page === totalPages ? 0.5 : 1
  } as CSSProperties

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
                        <div className="flex gap-4 flex-wrap">
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
                  <TableHead>#</TableHead>
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
                    <TableCell className="text-muted-foreground">{totalCount - (page - 1) * itemsPerPage - i}</TableCell>
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
                      <div className="flex gap-4 flex-wrap">
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
          {totalCount > 0 && (
              <div className="flex gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={prev} style={prevStyle} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink onClick={() => setPage(i + 1)} isActive={page === i + 1}>{i + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={next} style={nextStyle} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Items Per Page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          )}
        </>
      )}
    </div >
  )
}
