'use client'

import { TopicModel } from "@/app/models/topic";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Props {
  loading: boolean,
  topics: TopicModel[],
  topicToggle(topic: TopicModel, checked: boolean): void
}

export default function TopicSelection({ loading, topics, topicToggle }: Props) {
  const [toggleDesc, setToggleDesc] = useState(true)

  function Topic(topic: TopicModel) {
    return (
      <div className="flex items-start gap-4 bg-white p-4 border rounded-md">
        <Checkbox checked={topic.selected} disabled={loading} onCheckedChange={(e: boolean) => topicToggle(topic, e)} />
        <div className="flex flex-col gap-2 w-full">
          <Label>{topic.title}</Label>
          {toggleDesc && <p className="text-sm text-muted-foreground">{topic.description}</p>}
          {topic.children?.map((child, i) => (
            <div key={i}>{Topic(child)}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle Description */}
      <div className="flex items-center gap-4">
        <Switch id="toggle-desc" checked={toggleDesc} onCheckedChange={setToggleDesc} disabled={loading} />
        <Label htmlFor="toggle-desc">Toggle Description</Label>
      </div>
      {topics.map((topic, i) => (
        <div key={i}>{Topic(topic)}</div>
      ))}
    </div>
  )
}