import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Course } from "@/app/interfaces/course"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')

  const promise = supabase
    .from('courses')
    .select('*, languages:course-languages(*)')

  if (id) {
    promise.eq('id', id).single()
  }

  const { data, error } = await promise

  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { title, description, targetAudience, learningObjectives, level, duration, languages } = await req.json() as Course

  const { data: course } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      targetAudience,
      learningObjectives,
      level,
      duration,
      status: 'draft'
    })
    .select('id')
    .single()

  const { } = await supabase
    .from('course-languages')
    .insert(languages.map((lang) => ({
      courseId: course?.id,
      languageId: lang.id
    })))


  return NextResponse.json(course, { status: 200 });
}