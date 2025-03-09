import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

async function sendSlackMessage(message: string) {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).replace(" am", " AM").replace(" pm", " PM")

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: `*🚀 Vishaya AI Keep-Alive Triggered!*  ${message}  📅 ${timestamp}`
    })
  })
}

export async function GET(req: NextRequest) {
  try {
    /* Simple authenticate */
    const token = req.nextUrl.searchParams.get("token")
    if (token !== process.env.HEALTH_CHECK_SECRET) {
      await sendSlackMessage("❌ Authorization failed")
      return NextResponse.json({ status: "unauthorized" }, { status: 401 });
    }

    /* Call to database */
    const { data, error } = await supabase
      .from('languages')
      .select()

    /* Check if error occurred */
    if (error) {
      await sendSlackMessage("❌ Call to database failed")
      return NextResponse.json({ status: "database error", error }, { status: 500 });
    }

    /* Check if data is found */
    if (data.length === 0) {
      await sendSlackMessage("❌ No data found")
      return NextResponse.json({ status: "no data found" }, { status: 404 });
    }

    /* Send success message */
    await sendSlackMessage("✅ Keep-alive check executed successfully")
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    await sendSlackMessage("❌ Internal server error")
    return NextResponse.json({ status: "internal server error", error }, { status: 500 });
  }
}
