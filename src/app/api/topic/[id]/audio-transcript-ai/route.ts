import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { Topic } from "@/app/interfaces/topic";

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function GET(req: NextRequest,  { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('topics')
    .select()
    .eq('id', params.id)
  const topic = data![0] as Topic

  const prompt = `
    Provide a conversational-style transcript on ${topic.topic}, as if you were explaining it verbally to someone. The tone should be friendly and engaging, like you're speaking directly to an audience.

    Here is the summary of the topic for better context - ${topic.description}

    Output only plain text. Do not output markdown.
  `;

  const result = await model.generateContent(prompt);
  return NextResponse.json(result.response.text(), { status: 200 });
}