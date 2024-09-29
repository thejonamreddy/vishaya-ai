'use client'

import { Course } from "@/app/interfaces/course";
import { Topic } from "@/app/interfaces/topic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContentGeneration({ params }: { params: { id: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course>()
  const [topics, setTopics] = useState<Topic[]>([])

  async function loadData() {
    try {
      setLoading(true)
      const coursePromise = fetch(`/api/course?id=${params.id}`)
      const outlinePromise = fetch(`/api/course/${params.id}/outline`)
      const response = await Promise.all([coursePromise, outlinePromise])

      const courseData = await response[0].json() as Course
      const topicsData = await response[1].json() as Topic[]
      
      setCourse(courseData)
      setTopics(topicsData)
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

  function redirectToTopic(topic: Topic) {
    router.push(`/courses/${params.id}/content/topic/${topic.id}`)
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-[800px] mx-auto flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Content Generation</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Loading */}
              {loading && !topics.length && (
                <div className="flex gap-4 items-center">
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                  <Label className="text-muted-foreground">Fetching Outline</Label>
                </div>
              )}
              {!!topics.length && (
                <div className="flex flex-col gap-4">
                  {topics.filter((t) => t.selected).map((t, i) => (
                    <>
                      <div key={t.key} className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                        <div className="grid gap-1.5 leading-none w-full">
                          <label htmlFor={t.key} className="text-sm font-medium leading-none">{i + 1}. {t.topic}</label>
                          <p className="text-sm text-muted-foreground">{t.description}</p>
                        </div>
                        {t.audios.length ? (
                          <Button variant="secondary" size="icon" className="h-7 w-7" disabled>
                            <Check className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => redirectToTopic(t)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {t.subTopics.filter((st) => st.selected).map((st, j) => (
                        <div key={st.key} className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3 ml-6">
                          <div className="grid gap-1.5 leading-none w-full">
                            <label htmlFor={st.key} className="text-sm font-medium leading-none">{i + 1}.{j + 1}. {st.subTopic}</label>
                            <p className="text-sm text-muted-foreground">{st.description}</p>
                          </div>
                          <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </>
                  ))}
                  <Button>Preview</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
