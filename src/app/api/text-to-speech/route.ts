import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { text, language } = await req.json()
  
  const response = await fetch('https://api.sarvam.ai/text-to-speech', {
    method: 'POST',
    headers: {
      'API-Subscription-Key': process.env.SARVAM_API_KEY || "",
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: language,
      enable_preprocessing: true
    })
  })

  const result = await response.json();
  return NextResponse.json(result, { status: 200 });
}