'use client'

import { z } from "zod";
import CourseForm, { CourseFormSchema } from "./form";
import { Course } from "@/app/interfaces/course";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCourse() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: z.infer<typeof CourseFormSchema>) {
    try {
      setLoading(true)
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      router.push(`/courses/${data.id}/outline`)
    } catch {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-[500px] mx-auto flex flex-col gap-4">
        <h1 className="text-xl font-semibold">New Course</h1>
        <CourseForm loading={loading} course={{} as Course} submit={onSubmit} />
      </div>
    </div>
  );
}
