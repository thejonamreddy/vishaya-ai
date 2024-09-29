'use client'

import { Topic } from "@/app/interfaces/topic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronLeft, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import Topics from "./topics"
import { useRouter } from "next/navigation"
import { Course } from "@/app/interfaces/course"

export default function OutlineRefinement({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Fetching Course')
  const [course, setCourse] = useState<Course>()
  const [topics, setTopics] = useState<Topic[]>([])

  async function loadData() {
    try {
      setLoading(true)
      const courseResponse = await fetch(`/api/course?id=${params.id}`)
      const course = await courseResponse.json() as Course
      setCourse(course)

      const isDraft = (course.status === 'draft')
      setLoadingMessage(isDraft ? 'Generating Outline' : 'Fetching Outline')

      const outlineResponse = await fetch(isDraft ? `/api/course/${params.id}/outline-ai` : `/api/course/${params.id}/outline`)
      const topics = await outlineResponse.json() as Topic[]
      setCourse(course)
      setTopics(topics)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      loadData()
    }
  }, [params.id])

  function onTopicToggle(key: string, checked: boolean) {
    const topic = topics.find((t) => t.key === key)
    if (topic) {
      topic.selected = checked
      topic.subTopics.forEach((s) => {
        s.selected = checked
      })
      setTopics([...topics])
    }
  }

  function onSubTopicToggle(topicKey: string, subTopicKey: string, checked: boolean) {
    const topic = topics.find((t) => t.key === topicKey)
    if (topic) {
      const subTopic = topic.subTopics.find((s) => s.key === subTopicKey)
      if (subTopic) {
        subTopic.selected = checked
        const atleastOneSubTopic = topic.subTopics.some((s) => s.selected)
        topic.selected = atleastOneSubTopic
        setTopics([...topics])
      }
    }
  }

  async function regenerate() {
    try {
      setLoading(true)
      setTopics([])
      await loadData()
    } catch(error) {

    } finally {
      setLoading(false)
    }
  }

  async function proceed() {
    try {
      setLoading(true)
      const response = await fetch(`/api/course/${params.id}/outline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topics)
      })
      const result = await response.json()
      router.push(`/courses/${params.id}/content`)
    } catch(error) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Outline Creation & Refinement</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Loading */}
              {loading && !topics.length && (
                <div className="flex gap-4 items-center">
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                  <Label className="text-muted-foreground">{loadingMessage}</Label>
                </div>
              )}
              {/* Topics & Sub Topics Selection */}
              {!!topics.length && (
                <div className="flex flex-col gap-4">
                  <Topics loading={loading} topics={topics} topicToggle={onTopicToggle} subTopicToggle={onSubTopicToggle} />
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" disabled={loading} onClick={regenerate}>Regenerate</Button>
                    <Button className="flex-1 flex gap-4 items-center" disabled={loading} onClick={proceed}>
                      Proceed
                      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}