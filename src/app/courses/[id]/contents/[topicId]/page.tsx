'use client'

import { Topic } from "@/app/interfaces/topic"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { LoaderCircle, Pencil, Save, WandSparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { SyntheticEvent, useEffect, useState } from "react"
import { Course } from "@/app/interfaces/course"
import { Language } from "@/app/interfaces/language"
import { getAudioUrl } from "@/app/utils/topic.util"

export default function TopicContentGeneration({ params }: { params: { id: string, topicId: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState<Language[]>([])
  const [course, setCourse] = useState<Course>()
  const [topic, setTopic] = useState<Topic>()
  const [audioTranscript, setAudioTranscript] = useState<{
    [id: string]: string,
  }>({})
  const [audioBase64, setAudioBase64] = useState<{
    [id: string]: string,
  }>({})
  const [audioUrl, setAudioUrl] = useState<{
    [id: string]: string,
  }>({})
  const [audioDuration, setAudioDuration] = useState<{
    [id: string]: number,
  }>({})
  const [lockAudioTranscript, setLockAudioTranscript] = useState<{
    [id: string]: boolean
  }>({})

  const defaultLanguage = 'en-IN'
  const defaultLanguageId = languages.find((lang) => lang.code === defaultLanguage)?.id as string
  const defaultLanguageName = languages.find((lang) => lang.code === defaultLanguage)?.name as string
  const defaultAudioTranscript = audioTranscript[defaultLanguageId]
  const defaultAudioUrl = audioUrl[defaultLanguageId]
  const defaultLockAudioTranscript = lockAudioTranscript[defaultLanguageId]

  async function loadData() {
    try {
      setLoading(true)
      const languagePromise = fetch('/api/language')
      const coursePromise = fetch(`/api/course?id=${params.id}`)
      const topicPromise = await fetch(`/api/topic?id=${params.topicId}`)
      const response = await Promise.all([languagePromise, coursePromise, topicPromise])
      const languagesData = await response[0].json() as Language[]
      const courseData = await response[1].json() as Course
      const topicData = await response[2].json() as Topic
      setLanguages(languagesData)
      setCourse(courseData)
      setTopic(topicData)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id && params.topicId) {
      loadData()
    }
  }, [])

  async function generateAudioTranscript(id: string) {
    try {
      setLoading(true)
      setAudioTranscript({ [id]: '' })
      setAudioBase64({ [id]: '' })
      setAudioUrl({ [id]: '' })
      setAudioDuration({ [id]: 0 })
      const response = await fetch(`/api/audio-transcript-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topic)
      })
      const data = await response.json()
      setAudioTranscript({ ...audioTranscript, [id]: data })
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function translateAudioTranscript(id: string) {
    try {
      setLoading(true)
      setAudioTranscript({ ...audioTranscript, [id]: '' })
      setAudioBase64({ ...audioBase64, [id]: '' })
      setAudioUrl({ ...audioUrl, [id]: '' })
      setAudioDuration({ ...audioDuration, [id]: 0 })
      const response = await fetch(`/api/translate-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: defaultAudioTranscript,
          sourceLanguage: defaultLanguage,
          targetLanguage: languages.find((lang) => lang.id === id)?.code
        }),
      })
      const data = await response.json()
      setAudioTranscript({ ...audioTranscript, [id]: data })
    } catch {
    } finally {
      setLoading(false)
    }
  }

  async function generateAudio(id: string) {
    try {
      setLoading(true)
      setAudioBase64({ ...audioBase64, [id]: '' })
      setAudioUrl({ ...audioUrl, [id]: '' })
      setAudioDuration({ ...audioDuration, [id]: 0 })
      const response = await fetch('/api/text-to-speech-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: audioTranscript[id],
          language: languages.find((lang) => lang.id === id)?.code
        }),
      })
      const data = await response.json()
      const url = getAudioUrl(data)
      setAudioBase64({ ...audioBase64, [id]: data })
      setAudioUrl({ ...audioUrl, [id]: url })
    } catch {
    } finally {
      setLoading(false)
    }
  }

  function saveAudioTranscript(id: string, flag: boolean) {
    setLockAudioTranscript({ ...lockAudioTranscript, [id]: flag })
  }

  async function save() {
    try {
      setLoading(true)
      const { } = await fetch(`/api/topic/${params.topicId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course?.languages.map(({ languageId }) => ({
          transcript: audioTranscript[languageId],
          wav: audioBase64[languageId],
          languageId: languageId,
          duration: audioDuration[languageId],
          courseId: params.id
        }))),
      })
      router.push(`/courses/${params.id}/contents`)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  function onLoadedMetadata(e: SyntheticEvent<HTMLAudioElement, Event>, id: string) {
    setAudioDuration({...audioDuration, [id]: e.currentTarget.duration })
  }

  const EnglishLanguage = (
    <div className="flex flex-col gap-4 bg-white p-4 border rounded-md">
      <h2 className="font-semibold">{defaultLanguageName}</h2>
      <Textarea disabled={loading || defaultLockAudioTranscript} value={defaultAudioTranscript} />
      {defaultAudioUrl && <audio controls={!loading} src={defaultAudioUrl} onLoadedMetadata={(e) => onLoadedMetadata(e, defaultLanguageId) } />}
      {defaultLockAudioTranscript && (
        <div className="flex gap-4 items-center">
          <Button disabled={loading} variant="outline" onClick={() => generateAudio(defaultLanguageId)} className="flex gap-4 items-center">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" /> }
            Generate Audio
          </Button>
          <Button disabled={loading} onClick={() => saveAudioTranscript(defaultLanguageId, false)} className="flex gap-4 items-center">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>
      )}
      {!defaultLockAudioTranscript && (
        <div className="flex gap-4 items-center">
          <Button variant="outline" disabled={loading} className="flex items-center gap-4" onClick={() => generateAudioTranscript(defaultLanguageId)}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" /> }
            Generate Audio Transcript
          </Button>
          <Button disabled={loading || !defaultAudioTranscript} onClick={() => saveAudioTranscript(defaultLanguageId, true)} className="flex gap-4 items-center">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      )}
    </div>
  )

  function GenericLanguage(id: string) {
    return (
      <div className="flex flex-col gap-4 bg-white p-4 border rounded-md">
        <h2 className="font-semibold">{languages.find((lang) => lang.id === id)?.name}</h2>
        <Textarea disabled={loading || lockAudioTranscript[id]} value={audioTranscript[id]} />
        {audioUrl[id] && <audio controls={!loading} src={audioUrl[id]} onLoadedMetadata={(e) => onLoadedMetadata(e, id) } />}
        {lockAudioTranscript[id] && (
          <div className="flex gap-4 items-center">
            <Button disabled={loading} variant="outline" onClick={() => generateAudio(id)} className="flex gap-4 items-center">
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" /> }
              Generate Audio
            </Button>
            <Button disabled={loading} onClick={() => saveAudioTranscript(id, false)} className="flex gap-4 items-center">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </div>
        )}
        {!lockAudioTranscript[id] && (
          <div className="flex gap-4 items-center">
            <Button variant="outline" disabled={loading} className="flex items-center gap-4" onClick={() => translateAudioTranscript(id)}>
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Translate Audio Transcript
            </Button>
            <Button disabled={loading || !audioTranscript[id]} onClick={() => saveAudioTranscript(id, true)} className="flex gap-4 items-center">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        )}
      </div>
    )
  }

  const AudioTranscriptTab = (
    <div className="flex flex-col gap-4 mt-4">
      {EnglishLanguage}
      {defaultLockAudioTranscript && course?.languages.filter((course) => course.languageId !== defaultLanguageId).map(({ languageId }) => (
        <div>{GenericLanguage(languageId)}</div>
      ))}
    </div>
  )

  const ContentTabs = (
    <Tabs defaultValue="audio-transcript">
      <TabsList className="grid grid-cols-4 w-[768px] bg-muted-foreground/10">
        <TabsTrigger value="audio-transcript" disabled={loading}>Audio Transcript</TabsTrigger>
        <TabsTrigger value="content" disabled={loading}>Content</TabsTrigger>
        <TabsTrigger value="image" disabled={loading}>Image</TabsTrigger>
        <TabsTrigger value="video" disabled={loading}>Video</TabsTrigger>
      </TabsList>
      <TabsContent value="audio-transcript">
        {AudioTranscriptTab}
      </TabsContent>
      <TabsContent value="content">
      </TabsContent>
      <TabsContent value="image">
      </TabsContent>
      <TabsContent value="video">
      </TabsContent>
    </Tabs>
  )

  return (
    <div className="flex flex-col gap-4">
      {loading && !languages.length && !course && !topic ? (
        <LoaderCircle className="h-6 w-6 animate-spin" />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 bg-white p-4 border rounded-md">
            <Label>{topic?.title}</Label>
            <p className="text-sm text-muted-foreground">{topic?.description}</p>
          </div>
          {ContentTabs}
          <div>
            <Button disabled={loading} className="flex gap-4 items-center" onClick={save}>
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" /> }
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}