'use client'

import { TopicContent } from "@/app/interfaces/topic-content";
import { TopicModel } from "@/app/models/topic";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Check, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  loading: boolean,
  topics: TopicModel[],
  contents: TopicContent[],
  courseId: string
}

export default function TopicCompletion({ loading, topics, contents, courseId }: Props) {
  const router = useRouter()
  
  const [toggleDesc, setToggleDesc] = useState(true)

  function hasContent(topic: TopicModel) {
    return contents.some(({ topicId }) => topic.id === topicId)
  }

  function Topic(topic: TopicModel, label: string) {
    return (
      <div className="flex items-center gap-4 bg-white p-4 border rounded-md">
        <div className="flex flex-col gap-2 w-full">
          <Label>{label} {topic.title}</Label>
          {toggleDesc && <p className="text-sm text-muted-foreground">{topic.description}</p>}
          {topic.children?.filter((child) => child.selected).map((child, i) => (
            <div key={i}>{Topic(child, `${label}${i + 1}.`)}</div>
          ))}
        </div>
        {!topic.children.length && (
          <div className="flex gap-4">
            {hasContent(topic) && (
              <Button variant="outline" size="icon" onClick={() => redirectToTopic(topic)} disabled={loading}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button variant={hasContent(topic) ? 'secondary' : 'default'} size="icon" onClick={() => redirectToTopic(topic)} disabled={loading || hasContent(topic)}>
              {hasContent(topic) ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    )
  }

  function redirectToTopic(topic: TopicModel) {
    router.push(`/courses/${courseId}/contents/${topic.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle Description */}
      <div className="flex items-center gap-4">
        <Switch id="toggle-desc" checked={toggleDesc} onCheckedChange={setToggleDesc} disabled={loading} />
        <Label htmlFor="toggle-desc">Toggle Description</Label>
      </div>
      {topics.filter((topic) => topic.selected).map((topic, i) => (
        <div key={i}>{Topic(topic, `${i + 1}.`)}</div>
      ))}
    </div>
  )
}