// app/api/generate-blog/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // Streaming ke liye edge best aur fast hai

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();
    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
    }

    const prompt = `Write a comprehensive, high-quality SEO-optimized blog post in a mix of English and simple Roman Urdu about the latest online scam in Pakistan related to: "${keyword}". 
    The response must include:
    - A catchy title
    - An emoji and category (e.g. "Scam Alert" or "WhatsApp")
    - A short summary/description (under 150 characters for SEO)
    - Detailed content formatted beautifully in Markdown with headings (##), bold text (**), and lists.
    - Include 5 critical warning signs and a guide on how to report to FIA Cybercrime (Helpdesk 9911).`;

    // 🚀 Stream API Endpoint call kiya
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: errText }, { status: response.status });
    }

    // ReadableStream banaya taake frontend ko chunk-by-chunk data miley
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          // Gemini SSE stream lines ko parse karna
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim().startsWith(",")) continue;
            try {
              // Clean leading chunks if needed
              let cleanLine = line.replace(/^\[/, "").replace(/^,/, "").trim();
              if (cleanLine.endsWith("]")) cleanLine = cleanLine.slice(0, -1);
              
              if (!cleanLine) continue;
              
              const parsed = JSON.parse(cleanLine);
              const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textChunk) {
                controller.enqueue(encoder.encode(textChunk));
              }
            } catch (e) {
              // Partial line buffer wait
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}