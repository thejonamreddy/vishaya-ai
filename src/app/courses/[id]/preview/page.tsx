'use client'

import { Course } from "@/app/interfaces/course"
import { Topic } from "@/app/interfaces/topic"
import { TopicContent } from "@/app/interfaces/topic-content"
import { TopicModel } from "@/app/models/topic"
import { getAudioUrl, listToTree } from "@/app/utils/topic.util"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LoaderCircle, Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Language } from "@/app/interfaces/language"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stepper } from "@/components/custom/stepper"

export default function CoursePreview({ params }: { params: { id: string } }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<Language[]>([])
  const [course, setCourse] = useState<Course>()
  const [topics, setTopics] = useState<TopicModel[]>([])
  const [contents, setContents] = useState<TopicContent[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<TopicModel>()
  const [audioUrl, setAudioUrl] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')

  async function loadData() {
    try {
      setLoading(true)

      const languagesPromice = fetch(`/api/language`)
      const coursePromise = fetch(`/api/course?id=${params.id}`)
      const topicsPromise = fetch(`/api/course/${params.id}/topic`)
      const contentsPromise = fetch(`/api/course/${params.id}/content`)

      const response = await Promise.all([languagesPromice, coursePromise, topicsPromise, contentsPromise])

      const languagesData = await response[0].json() as Language[]
      const courseData = await response[1].json() as Course
      const topicsData = await response[2].json() as Topic[]
      const contentsData = await response[3].json() as TopicContent[]

      const topicModels = listToTree(topicsData)

      setLanguages(languagesData)
      setCourse(courseData)
      setTopics(topicModels)
      setContents(contentsData)
      setSelectedLanguage(languagesData.find((lang) => lang.code === 'en-IN')?.id as string)
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

  useEffect(() => {
    if (audioUrl) {
      play()
    }
  }, [audioUrl])

  function secondsToHMS(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    // const secs = seconds % 60;

    // Adding leading zeros if needed
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    // const formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  }

  function getFormattedDuration(topic: TopicModel) {
    const duration = contents?.find((t) => t.topicId === topic.id)?.duration as number
    return secondsToHMS(duration)
  }

  function play() {
    const audio = audioRef.current;
    if (audio) {
      audio.play()
      setIsPlaying(true)
    }
  }

  function pause() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause()
      setIsPlaying(false)
    }
  }

  function playTopic(topic: TopicModel) {
    if (topic.id === selectedTopic?.id) {
      play()
    } else {
      setSelectedTopic(topic)
      const wav = contents.find((c) => c.topicId === topic.id && c.languageId === selectedLanguage)?.wav as string
      const url = getAudioUrl(wav)
      setAudioUrl(url)
    }
  }

  function onLanguageChange(id: string) {
    setSelectedLanguage(id)
    setIsPlaying(false)
    setSelectedTopic(undefined)
    setAudioUrl('')
  }

  function isTopicPlaying(topic: TopicModel) {
    return (topic.id === selectedTopic?.id) && isPlaying
  }

  function Topic(topic: TopicModel) {
    return (
      <div className="flex items-center gap-4 bg-white p-4 border rounded-md">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-4 items-center">
            {!topic.children.length && (
              <div>
                {isTopicPlaying(topic) ? (
                  <Button variant="secondary" size="icon" onClick={pause}>
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="icon" onClick={() => playTopic(topic)}>
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <Label className="flex-1">{topic.title}</Label>
            {!topic.children.length && (
              <p className="text-sm text-muted-foreground">{getFormattedDuration(topic)}</p>
            )}
          </div>
          {topic.children?.filter((child) => child.selected).map((child, i) => (
            <div key={i}>{Topic(child)}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {loading && !course && !topics.length ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="flex flex-col gap-4">
          <Stepper step={4} course={course as Course} />
          <div className="grid grid-cols-[1fr_480px] gap-4">
            <div className="flex flex-col gap-4">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                  alt="Photo by Drew Beamer"
                  fill
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
              <div className="bg-white border rounded-md p-2">
                <audio controls className="w-full" ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{course?.title}</Label>
                <p className="text-sm text-muted-foreground">{course?.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white">
                <Select value={selectedLanguage} onValueChange={onLanguageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {course?.languages.map((c) => (
                      <SelectItem key={c.languageId} value={c.languageId}>{languages.find((lang) => lang.id === c.languageId)?.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {topics.filter((topic) => topic.selected).map((topic, i) => (
                <div key={i}>{Topic(topic)}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}