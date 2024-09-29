import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const schema = {
  type: SchemaType.OBJECT,
  description: "Topic audio transcript and content",
  properties: {
    audioTranscript: {
      type: SchemaType.STRING,
      description: "Audio transcript for the topic"
    },
    content: {
      type: SchemaType.STRING,
      description: "Content for the topic"
    }
  },
  required: ["audioTranscript", "content"]
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export async function POST(req: NextRequest) {
  const { topic } = await req.json()

  const prompt = `
    Generate content for the topic ${topic}. It should summarize what this topic and its sub topics cover. Generate audio transcript for this content. 
  `;

  const result = await model.generateContent(prompt);
  return NextResponse.json(result.response.text(), { status: 200 });
}