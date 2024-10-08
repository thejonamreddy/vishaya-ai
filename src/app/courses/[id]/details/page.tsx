'use client'

import { z } from "zod";
import CourseForm, { CourseFormSchema } from "../../new/form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Language } from "@/app/interfaces/language";
import { LoaderCircle } from "lucide-react";
import { Course } from "@/app/interfaces/course";
import { Stepper } from "@/components/custom/stepper";

export default function CourseDetail({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<Language[]>([])
  const [course, setCourse] = useState<Course>()

  async function loadData() {
    try {
      setLoading(true)
      const languagesPromise = fetch('/api/language')
      const coursePromise = fetch(`/api/course?id=${params.id}`)

      const response = await Promise.all([languagesPromise, coursePromise])
      
      const languagesData = await response[0].json() as Language[]
      const courseData = await response[1].json() as Course

      setLanguages(languagesData)
      setCourse(courseData)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function onSubmit(formData: z.infer<typeof CourseFormSchema>) {
    try {
      setLoading(true)
      const { title, description, targetAudience, learningObjectives, level, duration } = formData
      const { } = await fetch(`/api/course/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          targetAudience,
          learningObjectives,
          level,
          duration,
          languages: formData.languages.map((l) => ({ languageId: l }))
        })
      })
      router.push(`/courses/${params.id}/topics`)
    } catch {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && !languages.length && !course ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="flex flex-col gap-4">
          <Stepper step={1} courseId={params.id} />
          <div className="max-w-[480px]">
            <CourseForm loading={loading} languages={languages} course={course} submit={onSubmit} />
          </div>
        </div>
      )}
    </div>
  );
}
