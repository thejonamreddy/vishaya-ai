import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = req.nextUrl.searchParams
  const excludeWav = searchParams.get('excludeWav') === 'true'
  const topicId = searchParams.get('topicId')
  const query = supabase
    .from('topic-contents')
    .select(excludeWav ? 'id,createdAt,updatedAt,topicId,transcript,languageId,duration,courseId' : '*')
    .eq('courseId', params.id)

    if (topicId) {
      query.eq('topicId', topicId)
    }

  const { data } = await query

  return NextResponse.json(data, { status: 200 });
}