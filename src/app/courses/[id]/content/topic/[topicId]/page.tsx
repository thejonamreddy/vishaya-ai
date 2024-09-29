'use client'

import { Topic } from "@/app/interfaces/topic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Course } from "@/app/interfaces/course"

const languages = [
  { id: "en-IN", label: "English (India)", disabled: true },
  { id: "hi-IN", label: "Hindi (India)" },
  { id: "bn-IN", label: "Bangla (India)" },
  { id: "kn-IN", label: "Kannada (India)" },
  { id: "ml-IN", label: "Malayalam (India)" },
  { id: "mr-IN", label: "Marathi (India)" },
  { id: "od-IN", label: "Odia (India)" },
  { id: "pa-IN", label: "Punjabi (India)" },
  { id: "ta-IN", label: "Tamil (India)" },
  { id: "te-IN", label: "Telugu (India)" },
  { id: "gu-IN", label: "Gujarati (India)" },
]

export default function ContentGeneration({ params }: { params: { id: string, topicId: string } }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course>()
  const [topic, setTopic] = useState<Topic>()
  const [audioTranscript, setAudioTranscript] = useState<{
    [language: string]: string,
  }>({})
  const [audioBase64, setAudioBase64] = useState<{
    [language: string]: string,
  }>({})
  const [audioUrl, setAudioUrl] = useState<{
    [language: string]: string,
  }>({})
  const [lockAudioTranscript, setLockAudioTranscript] = useState<{
    [language: string]: boolean
  }>({})

  const defaultAudioTranscript = audioTranscript['en-IN']
  const defaultAudioUrl = audioUrl['en-IN']
  const defaultLockAudioTranscript = lockAudioTranscript['en-IN']

  async function loadData() {
    try {
      setLoading(true)
      const coursePromise = fetch(`/api/course?id=${params.id}`)
      const topicPromise = await fetch(`/api/topic?id=${params.topicId}`)
      const response = await Promise.all([coursePromise, topicPromise])
      const courseData = await response[0].json() as Course
      const topicData = await response[1].json() as Topic
      setCourse(courseData)
      setTopic(topicData)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.topicId) {
      loadData()
    }
  }, [params.topicId])

  function back() {
    router.push(`/courses/${params.id}/content`)
  }

  async function generateAudioTranscript(language: string) {
    try {
      setLoading(true)
      setAudioTranscript({ [language]: '' })
      setAudioBase64({ [language]: '' })
      setAudioUrl({ [language]: '' })
      const response = await fetch(`/api/topic/${params.topicId}/audio-transcript-ai`)
      const data = await response.json()
      setAudioTranscript({ ...audioTranscript, [language]: data })
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  function getAudioUrl(base64Wav: string) {
    const byteCharacters = atob(base64Wav); // Decode Base64 to binary string
    const byteNumbers = new Array(byteCharacters.length);

    // Convert binary string to byte array
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob); // Create Object URL from Blob

    return url
  }

  async function generateAudio(language: string) {
    try {
      setLoading(true)
      setAudioBase64({ ...audioBase64, [language]: '' })
      setAudioUrl({ ...audioUrl, [language]: '' })
      const response = await fetch('/api/text-to-speech-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: audioTranscript[language],
          language: language
        }),
      })
      const data = await response.json()
      const url = getAudioUrl(data)
      setAudioBase64({ ...audioBase64, [language]: data })
      setAudioUrl({ ...audioUrl, [language]: url })
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  function saveAudioTranscript(language: string, flag: boolean) {
    setLockAudioTranscript({ ...lockAudioTranscript, [language]: flag })
  }

  async function translateAudioTranscript(language: string) {
    try {
      setLoading(true)
      setAudioTranscript({ ...audioTranscript, [language]: '' })
      setAudioBase64({ ...audioBase64, [language]: '' })
      setAudioUrl({ ...audioUrl, [language]: '' })
      const response = await fetch(`/api/translate-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: audioTranscript['en-IN'],
          sourceLanguage: 'en-IN',
          targetLanguage: language
        }),
      })
      const data = await response.json()
      setAudioTranscript({ ...audioTranscript, [language]: data })
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  async function save() {
    try {
      setLoading(true)
      const response = await fetch(`/api/topic/${params.topicId}/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course?.languages.map((lang) => ({
          courseId: params.id,
          topicId: params.topicId,
          subTopicId: null,
          language: lang,
          transcript: audioTranscript[lang],
          wav: audioBase64[lang]
        }))),
      })
      const data = await response.json()
      router.push(`/courses/${params.id}/content`)
    } catch(error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-[800px] mx-auto flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={back}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Topic Content Generation</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Loading */}
              {loading && !topic && (
                <div className="flex gap-4 items-center">
                  <LoaderCircle className="h-6 w-6 animate-spin" />
                  <Label className="text-muted-foreground">Fetching Topic</Label>
                </div>
              )}
              {topic && (
                <div className="flex flex-col gap-4">
                  <div key={topic.key} className="flex flex-row items-center space-x-2 space-y-0">
                    <div className="grid gap-1.5 leading-none w-full">
                      <label htmlFor={topic.key} className="text-sm font-medium leading-none">{topic.topic}</label>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {topic && (
          <Tabs defaultValue="audio-transcript">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="audio-transcript" disabled={loading}>Audio Transcript</TabsTrigger>
              <TabsTrigger value="content" disabled={loading}>Content</TabsTrigger>
              <TabsTrigger value="image" disabled={loading}>Image</TabsTrigger>
              <TabsTrigger value="video" disabled={loading}>Video</TabsTrigger>
            </TabsList>
            <TabsContent value="audio-transcript">
              <div className="flex flex-col gap-4 mt-4">
                <Card>
                  <CardHeader className="pb-0">
                    <CardTitle>English (India)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 mt-4">
                      <Textarea disabled={loading || defaultLockAudioTranscript} value={defaultAudioTranscript} />
                      {defaultLockAudioTranscript && defaultAudioUrl && <audio controls={!loading} src={defaultAudioUrl} />}
                      <div className="flex gap-4 items-center">
                        {!defaultLockAudioTranscript && (
                          <>
                            <Button variant="outline" disabled={loading} className="flex items-center gap-4" onClick={() => generateAudioTranscript('en-IN')}>
                              Generate Audio Transcript
                              {loading && !defaultAudioTranscript && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            </Button>
                            <Button disabled={loading || !defaultAudioTranscript} onClick={() => saveAudioTranscript('en-IN', true)}>Save</Button>
                          </>
                        )}
                        {defaultLockAudioTranscript && (
                          <>
                            <Button disabled={loading} variant="outline" onClick={() => generateAudio('en-IN')} className="flex gap-4 items-center">
                              Generate Audio
                              {loading && !defaultAudioUrl && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            </Button>
                            <Button disabled={loading} onClick={() => saveAudioTranscript('en-IN', false)}>Edit</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {defaultLockAudioTranscript && course?.languages.filter((lang) => lang !== 'en-IN').map((lang) => (
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle>{languages.find((l) => l.id === lang)?.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4 mt-4">
                        <Textarea disabled={loading} value={audioTranscript[lang]} />
                        {lockAudioTranscript[lang] && audioUrl[lang] && <audio controls={!loading} src={audioUrl[lang]} />}
                        <div className="flex gap-4 items-center">
                          {!lockAudioTranscript[lang] && (
                            <>
                              <Button variant="outline" disabled={loading} className="flex items-center gap-4" onClick={() => translateAudioTranscript(lang)}>
                                Translate Audio Transcript
                                {loading && !audioTranscript[lang] && <LoaderCircle className="h-4 w-4 animate-spin" />}
                              </Button>
                              <Button disabled={loading || !audioTranscript[lang]} onClick={() => saveAudioTranscript(lang, true)}>Save</Button>
                            </>
                          )}
                          {lockAudioTranscript[lang] && (
                            <>
                              <Button disabled={loading} variant="outline" onClick={() => generateAudio(lang)} className="flex gap-4 items-center">
                                Generate Audio
                                {loading && !audioUrl[lang] && <LoaderCircle className="h-4 w-4 animate-spin" />}
                              </Button>
                              <Button disabled={loading} onClick={() => saveAudioTranscript(lang, false)}>Edit</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="content">
            </TabsContent>
            <TabsContent value="image">
            </TabsContent>
            <TabsContent value="video">
            </TabsContent>
          </Tabs>
        )}
        {topic && (
          <Button disabled={loading} className="flex gap-4 items-center" onClick={save}>
            Save
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          </Button>
        )}
      </div>
    </div>
  )
}