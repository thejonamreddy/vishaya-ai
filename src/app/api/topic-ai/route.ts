import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Course } from "@/app/interfaces/course";

const schema = {
  type: SchemaType.ARRAY,
  description: "List of topics",
  minItems: 1,
  items: {
    type: SchemaType.OBJECT,
    description: "Details of the topic",
    properties: {
      title: {
        type: SchemaType.STRING,
        description: "Title of the topic"
      },
      description: {
        type: SchemaType.STRING,
        description: "Description of what this topic covers"
      },
      selected: {
        type: SchemaType.BOOLEAN,
        description: "Is always true"
      },
      children: {
        type: SchemaType.ARRAY,
        description: "List of sub topics",
        minItems: 1,
        items: {
          type: SchemaType.OBJECT,
          description: "Details of the sub topic",
          properties: {
            title: {
              type: SchemaType.STRING,
              description: "Title of the sub topic"
            },
            description: {
              type: SchemaType.STRING,
              description: "Description of what this sub topic covers"
            },
            selected: {
              type: SchemaType.BOOLEAN,
              description: "Is always true"
            },
          },
          required: ["title", "description", "selected"]
        }
      }
    },
    required: ["title", "description", "selected", "children"]
  }
};

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_LANGUAGE_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

export async function POST(req: NextRequest) {
  const { title, description, targetAudience, learningObjectives, level, duration } = await req.json() as Course

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

  const data = await model.generateContent(prompt);
  const jsonData = JSON.parse(data.response.text())
  return NextResponse.json(jsonData, { status: 200 });
}