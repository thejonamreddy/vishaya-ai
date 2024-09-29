import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Audio } from "@/app/interfaces/audio"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const { data, error } = await supabase
    .from('audios')
    .select()
    .eq('id', id)

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const audios = await req.json() as Audio[]

  const { data, error } = await supabase
    .from('audios')
    .insert(audios.map(({ courseId, topicId, subTopicId, language, transcript, wav }) => ({
      courseId,
      topicId,
      subTopicId,
      language,
      transcript,
      wav
    })))
    .select()

  return NextResponse.json(null, { status: 200 });
}