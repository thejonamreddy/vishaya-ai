'use client'

import { Topic } from "@/app/interfaces/topic";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface Props {
  loading: boolean,
  topics: Topic[],
  topicToggle(key: string, checked: boolean): void,
  subTopicToggle(topicKey: string, subTopicKey: string, checked: boolean): void
}

export default function Topics({ loading, topics, topicToggle, subTopicToggle }: Props) {
  const [toggleDesc, setToggleDesc] = useState(true)

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle Description */}
      <div className="flex items-center space-x-2">
        <Switch id="toggle-desc" checked={toggleDesc} onCheckedChange={setToggleDesc} />
        <Label htmlFor="toggle-desc">Toggle Description</Label>
      </div>
      {topics.map(({ key, topic, description, subTopics, selected }) => (
        <div key={key} className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-3">
          {/* Topic */}
          <Checkbox id={key} checked={selected} onCheckedChange={(e: boolean) => topicToggle(key, e)} disabled={loading} />
          <div className="grid gap-1.5 leading-none w-full">
            <label htmlFor={key} className="text-sm font-medium leading-none">{topic}</label>
            {toggleDesc && <p className="text-sm text-muted-foreground">{description}</p>}
            {!!subTopics.length && (
              <div className="flex flex-col gap-2 mt-2">
                {subTopics.map((s) => (
                  <div key={s.key} className="flex flex-row items-start space-x-2 space-y-0 rounded-md border p-3">
                    {/* Sub Topic */}
                    <Checkbox id={s.key} checked={s.selected} onCheckedChange={(e: boolean) => subTopicToggle(key, s.key, e)} disabled={loading} />
                    <div className="grid gap-1.5 leading-none w-full">
                      <label htmlFor={s.key} className="text-sm font-medium leading-none">{s.subTopic}</label>
                      {toggleDesc && <p className="text-sm text-muted-foreground">{s.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}