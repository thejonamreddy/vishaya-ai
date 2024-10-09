import { NextRequest, NextResponse } from "next/server"
import { Translate } from "@google-cloud/translate/build/src/v2";

const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_API_KEY
});

export async function POST(req: NextRequest) {
  const { text, sourceLanguage, targetLanguage } = await req.json()
  
  const response = await translate.translate(text, {
    from: sourceLanguage,
    to: targetLanguage
  })

  return NextResponse.json(response[0], { status: 200 });
}