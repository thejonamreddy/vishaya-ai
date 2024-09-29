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
      inputs: splitTextIntoChunks(text),
      target_language_code: language === 'en-IN' ? 'hi-IN' : language,
      enable_preprocessing: true
    })
  })

  const result = await response.json();
  const audioBuffer = combineWavFiles(result.audios)
  const audioBase64 = audioBuffer.toString('base64');
  return NextResponse.json(audioBase64, { status: 200 });
}

function splitTextIntoChunks(text: string, chunkSize = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

// Function to decode Base64 string to a Buffer
function base64ToBuffer(base64String: string) {
  return Buffer.from(base64String, 'base64');
};

// Function to combine multiple WAV files
function combineWavFiles(base64WavArray: string[]) {
  const wavHeaders = [] as Buffer[];
  const wavData = [] as Buffer[];
  let totalDataLength = 0;

  // Process each WAV file
  base64WavArray.forEach((base64Wav, index) => {
    const wavBuffer = base64ToBuffer(base64Wav);
    const header = wavBuffer.subarray(0, 44); // WAV header is the first 44 bytes
    const data = wavBuffer.subarray(44); // Audio data is after the header

    if (index === 0) {
      wavHeaders.push(header); // Keep the header of the first file
    }
    wavData.push(data); // Collect audio data of all files
    totalDataLength += data.length; // Sum the audio data length
  });

  // Combine the header and data into a new Buffer
  const combinedWav = Buffer.concat([wavHeaders[0], ...wavData]);

  // Update chunkSize and subChunk2Size in the header
  const chunkSize = 36 + totalDataLength; // This goes into bytes 4-7
  combinedWav.writeUInt32LE(chunkSize, 4);

  const subChunk2Size = totalDataLength; // This goes into bytes 40-43
  combinedWav.writeUInt32LE(subChunk2Size, 40);

  return combinedWav;
};