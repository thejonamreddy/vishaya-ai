import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Course } from "@/app/interfaces/course"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabase
    .from('courses')
    .select('*, languages:course-languages(*)')
    .eq('id', params.id)
    .single()

  return NextResponse.json(data, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, targetAudience, learningObjectives, level, duration, languages } = await req.json() as Course

  const { data: course } = await supabase
    .from('courses')
    .update({
      title,
      description,
      targetAudience,
      learningObjectives,
      level,
      duration
    })
    .eq('id', params.id)

  const { } = await supabase
    .from('course-languages')
    .delete()
    .eq('courseId', params.id)

  const { } = await supabase
    .from('course-languages')
    .insert(languages.map((lang) => ({
      courseId: params.id,
      languageId: lang.languageId
    })))

  return NextResponse.json(course, { status: 200 });
}