'use client'

import { Course } from "@/app/interfaces/course";
import { Topic } from "@/app/interfaces/topic";
import { Binoculars, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TopicCompletion from "./topic-completion";
import { TopicModel } from "@/app/models/topic";
import { listToTree } from "@/app/utils/topic.util";
import { TopicContent } from "@/app/interfaces/topic-content";
import { Button } from "@/components/ui/button";

export default function ContentGeneration({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course>()
  const [topics, setTopics] = useState<TopicModel[]>([])
  const [contents, setContents] = useState<TopicContent[]>([])

  async function loadData() {
    try {
      setLoading(true)

      const coursePromise = fetch(`/api/course?id=${params.id}`)
      const topicsPromise = fetch(`/api/course/${params.id}/topic`)
      const contentsPromise = fetch(`/api/course/${params.id}/content?excludeWav=true`)

      const response = await Promise.all([coursePromise, topicsPromise, contentsPromise])

      const courseData = await response[0].json() as Course
      const topicsData = await response[1].json() as Topic[]
      const contentsData = await response[2].json() as TopicContent[]

      const topicModels = listToTree(topicsData)

      setCourse(courseData)
      setTopics(topicModels)
      setContents(contentsData)
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

  function preview() {
    router.push(`/courses/${params.id}/preview`)
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && !course && !topics.length && !contents.length ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="flex flex-col gap-4">
          <TopicCompletion loading={loading} topics={topics} contents={contents} courseId={params.id} />
          <div>
            <Button disabled={loading} className="flex gap-4 items-center" onClick={preview}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Binoculars className="h-4 w-4" /> }
              Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
