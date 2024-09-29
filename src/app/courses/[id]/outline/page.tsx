'use client'

import { Topic } from "@/app/interfaces/topic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import Topics from "./topics"

export default function OutlineRefinement({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [topics, setTopics] = useState<Topic[]>([])

  async function loadData(id: string) {
    try {
      setLoading(true)
      const outlinePromise = fetch(`/api/course/${id}/outline`)
      const response = await Promise.all([outlinePromise])
      const topicsData = await response[0].json() as Topic[]
      setTopics(topicsData)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      loadData(params.id)
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
      await loadData(params.id)
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
    } catch(error) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Outline Creation & Refinement</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Loading */}
              {loading && !topics.length && (
                <div className="flex gap-4 items-center">
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                  <Label className="text-muted-foreground">Generating Outline</Label>
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