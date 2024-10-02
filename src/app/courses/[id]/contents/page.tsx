'use client'

import { Course } from "@/app/interfaces/course";
import { Topic } from "@/app/interfaces/topic";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TopicCompletion from "./topic-completion";
import { TopicModel } from "@/app/models/topic";
import { listToTree } from "@/app/utils/topic.util";

export default function ContentGeneration({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course>()
  const [topics, setTopics] = useState<TopicModel[]>([])

  async function loadData() {
    try {
      setLoading(true)

      const coursePromise = fetch(`/api/course?id=${params.id}`)
      const outlinePromise = fetch(`/api/course/${params.id}/topic`)
      const response = await Promise.all([coursePromise, outlinePromise])

      const courseData = await response[0].json() as Course
      const topicsData = await response[1].json() as Topic[]

      const topicModels = listToTree(topicsData)

      setCourse(courseData)
      setTopics(topicModels)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      loadData()
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      {loading && !course && !topics.length ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="flex flex-col gap-4">
          <TopicCompletion loading={loading} topics={topics} courseId={params.id} />
        </div>
      )}
    </div>
  );
}
