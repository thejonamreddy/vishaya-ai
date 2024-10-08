import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { TopicContent } from "@/app/interfaces/topic-content"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabase
    .from('topic-contents')
    .select()
    .eq('topicId', params.id)

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const audios = await req.json() as TopicContent[]

  const { } = await supabase
    .from('topic-contents')
    .insert(audios.map(({ languageId, transcript, wav, duration, courseId }) => ({
      topicId: params.id,
      languageId,
      transcript,
      wav,
      duration,
      courseId
    })))
    .select()

  const courseId = audios[0].courseId

  /* Get Topics Ids with Content */
  const { data: contentTopics } = await supabase
    .from('topic-contents')
    .select('topicId')
    .eq('courseId', courseId)

  const topicIds = contentTopics?.map((t) => t.topicId) || []

  /* Get Topic Ids missing Content */
  const { data: topics } = await supabase
    .from('course-topics')
    .select('id')
    .eq('courseId', courseId)
    .eq('selected', true)
    .not('parentId', 'is', null)
    .not('id', 'in', `(${topicIds.join(',')})`)

  /* Update Course Status */
  const { } = await supabase
    .from('courses')
    .update({ status: topics?.length ? 'prototyping' : 'ready' })
    .eq('id', courseId)

  return NextResponse.json(null, { status: 200 });
}