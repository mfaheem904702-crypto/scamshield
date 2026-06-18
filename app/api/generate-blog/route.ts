// app/api/generate-blog/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing on Vercel" }, { status: 500 });
    }

    const prompt = `Write a comprehensive, high-quality SEO-optimized blog post in a mix of English and simple Roman Urdu about the latest online scam in Pakistan related to: "${keyword}". 
    The response must include:
    - A catchy title
    - An emoji and category (e.g. "Scam Alert" or "WhatsApp")
    - A short summary/description (under 150 characters for SEO)
    - Detailed content formatted beautifully in Markdown with headings (##), bold text (**), and lists.
    - Include 5 critical warning signs and a guide on how to report to FIA Cybercrime (Helpdesk 9911).`;

    // 🚀 DIRECT FETCH API: Yeh Edge Runtime par bina kisi SDK ke 10x fast chalta hai aur timeout nahi hota
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${errText}`);
    }

    const resData = await response.json();
    const aiText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";

    return NextResponse.json({ 
      success: true, 
      message: "Blog generated successfully!",
      data: {
        title: `${keyword} Scam in Pakistan`,
        desc: `Learn how the new ${keyword} scam works and protect yourself.`,
        content: aiText,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        emoji: "🚨",
        cat: "Scam Alert"
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}