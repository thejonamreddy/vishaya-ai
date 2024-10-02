import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { TopicContent } from "@/app/interfaces/topic-content"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('topic-contents')
    .select()
    .eq('topicId', params.id)

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest,  { params }: { params: { id: string } }) {
  const audios = await req.json() as TopicContent[]

  const { data, error } = await supabase
    .from('topic-contents')
    .insert(audios.map(({ languageId, transcript, wav, duration, courseId  }) => ({
      topicId: params.id,
      languageId,
      transcript,
      wav,
      duration,
      courseId
    })))
    .select()

  return NextResponse.json(null, { status: 200 });
}