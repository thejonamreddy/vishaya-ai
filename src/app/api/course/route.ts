import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Course } from "@/app/interfaces/course"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('id', id)

  const course = data![0]
  course.languages = course.languages.split(',')

  return NextResponse.json(data![0], { status: 200 });
}

export async function POST(req: NextRequest) {
  const { title, description, targetAudience, learningObjectives, level, duration, languages } = await req.json() as Course

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      targetAudience,
      learningObjectives,
      level, 
      duration,
      status: 'draft',
      languages: languages.join(',')
    })
    .select()

  return NextResponse.json(data![0], { status: 200 });
}