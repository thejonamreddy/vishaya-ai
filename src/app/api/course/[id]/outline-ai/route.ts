import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { Topic } from "@/app/interfaces/topic";

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
      selected: {
        type: SchemaType.BOOLEAN,
        description: "Is always true"
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
            },
            selected: {
              type: SchemaType.BOOLEAN,
              description: "Is always true"
            },
          },
          required: ["key", "subTopic", "description", "selected"]
        }
      }
    },
    required: ["key", "topic", "subTopics", "description", "selected"]
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

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('id', params.id)
  const { title, description, targetAudience, learningObjectives, level, duration } = data![0]

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
  const jsonResult = JSON.parse(result.response.text())
  return NextResponse.json(jsonResult, { status: 200 });
}