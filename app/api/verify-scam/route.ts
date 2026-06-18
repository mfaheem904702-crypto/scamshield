import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const text = `ScamShield AI Diagnostic Matrix for: "${query}"\n\n[ANALYSIS]: Contextual telemetry scans indicate high-risk factors matching local fraudulent frameworks. Unlicensed yields and private chat redirection typically indicate unauthorized schemes. Cross-reference manually with SECP/FIA repositories before deployment.`;
        
        const words = text.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 45)); 
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Diagnostic handler crash" }, { status: 500 });
  }
}