import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Topic } from "@/app/interfaces/topic";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json() as Topic

    const prompt = `
      Provide a conversational-style transcript on ${title}, as if you were explaining it verbally to someone. The tone should be friendly and engaging, like you're speaking directly to an audience.

      Here is the summary of the topic for better context - ${description}

      Output only plain text. Do not output markdown. Should not be more than 1500 characters.
    `;

    const result = await model.generateContent(prompt);
    return NextResponse.json(result.response.text(), { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}