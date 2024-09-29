import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { text, sourceLanguage, targetLanguage } = await req.json()
  
  const response = await fetch('https://api.sarvam.ai/translate', {
    method: 'POST',
    headers: {
      'API-Subscription-Key': process.env.SARVAM_API_KEY || "",
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: text,
      source_language_code: sourceLanguage,
      target_language_code: targetLanguage,
      enable_preprocessing: true
    })
  })

  const result = await response.json();
  return NextResponse.json(result, { status: 200 });
}