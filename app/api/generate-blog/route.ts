// app/api/generate-blog/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🚀 1. NETWORK TIMEOUT FIX: Yeh line Vercel par 10-second ka limit khatam kar degi
export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Write a comprehensive, high-quality SEO-optimized blog post in a mix of English and simple Roman Urdu about the latest online scam in Pakistan related to: "${keyword}". 
    The response must include:
    - A catchy title
    - An emoji and category (e.g. "Scam Alert" or "WhatsApp")
    - A short summary/description (under 150 characters for SEO)
    - Detailed content formatted beautifully in Markdown with headings (##), bold text (**), and lists.
    - Include 5 critical warning signs and a guide on how to report to FIA Cybercrime (Helpdesk 9911).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

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