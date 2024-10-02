'use client'

import { Topic } from "@/app/interfaces/topic"
import { LoaderCircle, Save, WandSparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Course } from "@/app/interfaces/course"
import { TopicModel } from "@/app/models/topic"
import TopicSelection from "./topic-selection"
import { Button } from "@/components/ui/button"
import { listToTree } from "@/app/utils/topic.util"
import { Stepper } from "@/components/custom/stepper"

export default function Topics({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course>()
  const [aiGenerated, setAIGenerated] = useState(false)
  const [topics, setTopics] = useState<TopicModel[]>([])

  async function loadData() {
    try {
      setLoading(true)

      const courseResponse = await fetch(`/api/course?id=${params.id}`)
      const courseData = await courseResponse.json()

      const topicsResponse = await fetch(`/api/course/${params.id}/topic`)
      const topicsData = await topicsResponse.json() as Topic[]

      if (topicsData.length) {
        setAIGenerated(false)
        const topicModels = listToTree(topicsData)
        setTopics(topicModels)
      } else {
        setAIGenerated(true)
        const aiTopicsResponse = await fetch(`/api/topic-ai`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(courseData)
        })
        const aiTopics = await aiTopicsResponse.json() as TopicModel[]
        setTopics(aiTopics)
      }

      setCourse(courseData)
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

  function checkForSelected(nodes: TopicModel[]) {
    nodes.forEach((topic) => {
      if (topic.children?.length) {
        topic.selected = topic.children?.some((t) => t.selected)
        checkForSelected(topic.children)
      }
    })
  }

  function onTopicToggle(topic: TopicModel, checked: boolean) {
    topic.selected = checked
    topic.children?.forEach((t) => {
      t.selected = checked
    })
    checkForSelected(topics)
    setTopics([...topics])
  }

  async function generateTopics() {
    try {
      setLoading(true)
      const response = await fetch(`/api/topic-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
      })
      const data = await response.json() as TopicModel[]
      setTopics(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    try {
      setLoading(true)
      const { } = await fetch(`/api/course/${params.id}/topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topics)
      })
      router.push(`/courses/${params.id}/contents`)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && !course && !topics.length ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="flex flex-col gap-4">
          <Stepper step={2} courseId={params.id} />
          <TopicSelection loading={loading} topics={topics} topicToggle={onTopicToggle} />
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-4" disabled={loading} onClick={generateTopics}>
              {!loading && <WandSparkles className="h-4 w-4" />}
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Generate Topics
            </Button>
            <Button className="flex items-center gap-4" disabled={loading} onClick={save}>
              {!loading && <Save className="h-4 w-4" />}
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}