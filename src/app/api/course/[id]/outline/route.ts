import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";
import { Topic } from "@/app/interfaces/topic";

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data: topics } = await supabase
    .from('topics')
    .select('*, audios(id)')
    .eq('courseId', params.id)

  const { data: subTopics } = await supabase
    .from('subtopics')
    .select()
    .eq('courseId', params.id)

  topics!.forEach((t) => {
    t.subTopics = (subTopics || []).filter((st) => st.topicId === t.id)
  })

  return NextResponse.json(topics, { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const topics = await req.json() as Topic[]
  /* Delete Sub Topics */
  const { } = await supabase
    .from('subtopics')
    .delete()
    .eq('courseId', params.id)
  /* Delete Topics */
  const { } = await supabase
    .from('topics')
    .delete()
    .eq('courseId', params.id)
  /* Insert Topics & Sub Topics */
  for (let { key, topic, description, selected, subTopics } of topics) {
    const { data } = await supabase
      .from('topics')
      .insert({
        key,
        topic,
        description,
        selected,
        courseId: params.id
      })
      .select()

    const { } = await supabase
      .from('subtopics')
      .insert(subTopics.map((st) => ({
        key: st.key,
        subTopic: st.subTopic,
        description: st.description,
        selected: st.selected,
        courseId: params.id,
        topicId: data![0].id
      })))
    /* Update Course Status */
    const { } = await supabase
      .from('courses')
      .update({ status: 'outlined' })
      .eq('id', params.id)
  }

  return NextResponse.json(null, { status: 200 })
}
