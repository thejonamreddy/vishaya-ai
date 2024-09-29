import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const schema = {
  type: SchemaType.ARRAY,
  description: "List of topics",
  items: {
    type: SchemaType.OBJECT,
    description: "Details of the topic",
    properties: {
      key: {
        type: SchemaType.STRING,
        description: "Key of the topic"
      },
      topic: {
        type: SchemaType.STRING,
        description: "Name of the topic"
      },
      description: {
        type: SchemaType.STRING,
        description: "Description of what this topic covers"
      },
      subTopics: {
        type: SchemaType.ARRAY,
        description: "List of sub topics",
        items: {
          type: SchemaType.OBJECT,
          description: "Details of the sub topic",
          properties: {
            key: {
              type: SchemaType.STRING,
              description: "Key of the sub topic"
            },
            subTopic: {
              type: SchemaType.STRING,
              description: "Name of the sub topic"
            },
            description: {
              type: SchemaType.STRING,
              description: "Description of what this sub topic covers"
            }
          },
          required: ["key", "subTopic", "description"]
        }
      }
    },
    required: ["key", "topic", "subTopics", "description"]
  }
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
  const { title, description, targetAudience, learningObjectives, level, duration } = await req.json()

  const prompt = `
  Forget everything we've talked about.

  Suggest a course outline for a course with 
  Title: ${title}
  Description: ${description}
  Target Audience: ${targetAudience}
  Learning Objectives: ${learningObjectives}
  Level: ${level}
  Duration: ${duration}
  `;

  const result = await model.generateContent(prompt);
  return NextResponse.json(result.response.text(), { status: 200 });
}