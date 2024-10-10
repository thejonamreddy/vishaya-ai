import { NextRequest, NextResponse } from "next/server"
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

const client = new TextToSpeechClient({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY
});

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { text, language } = await req.json()

  const request = {
    input: { text: text },
    voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  } as never;
  const [response] = await client.synthesizeSpeech(request);

  return NextResponse.json((response.audioContent as Buffer).toString('base64'), { status: 200 });
}