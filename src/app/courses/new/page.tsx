'use client'

import { z } from "zod";
import CourseForm, { CourseFormSchema } from "./form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Language } from "@/app/interfaces/language";
import { LoaderCircle } from "lucide-react";

export default function NewCourse() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<Language[]>([])

  async function loadData() {
    try {
      setLoading(true)
      const response = await fetch('/api/language')
      const data = await response.json()
      setLanguages(data)
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
      const response = await fetch('/api/course', {
        method: 'POST',
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
          languages: formData.languages.map((l) => ({ id: l }))
        })
      })
      const data = await response.json()
      router.push(`/courses/${data.id}/topics`)
    } catch {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-[480px]">
      <h1 className="text-xl font-semibold">New Course</h1>
      {loading && !languages.length ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <CourseForm loading={loading} languages={languages} submit={onSubmit} />
      )}
    </div>
  );
}
