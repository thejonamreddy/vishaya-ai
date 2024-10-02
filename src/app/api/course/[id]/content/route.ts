import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = req.nextUrl.searchParams
  const excludeWav = searchParams.get('excludeWav') === 'true'
  const { data } = await supabase
    .from('topic-contents')
    .select(excludeWav ? 'id,createdAt,updatedAt,topicId,transcript,languageId,duration,courseId' : '*')
    .eq('courseId', params.id)

  return NextResponse.json(data, { status: 200 });
}