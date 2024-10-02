import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";
import { TopicModel } from "@/app/models/topic";

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabase
    .from('course-topics')
    .select()
    .eq('courseId', params.id)

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const topics = await req.json() as TopicModel[]

  /* Delete Topics */
  const { } = await supabase
    .from('course-topics')
    .delete()
    .eq('courseId', params.id)

  /* Insert Topics */
  for (const topic of topics) {
    const { title, description, selected } = topic
    const { data } = await supabase
      .from('course-topics')
      .insert({
        title,
        description,
        selected,
        courseId: params.id
      })
      .select('id')
      .single()

    if (data) {
      for (const child of topic.children) {
        const { title, description, selected } = child
        const { } = await supabase
          .from('course-topics')
          .insert({
            title,
            description,
            selected,
            courseId: params.id,
            parentId: data.id
          })
      }
    }
  }

  return NextResponse.json(null, { status: 200 })
}
