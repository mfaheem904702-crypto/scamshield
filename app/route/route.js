import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { query, checkType } = await request.json();

    // 1. Anthropic API ko server-side se safe call karna
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // Server se key uthaye ga
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022", // Latest stable fast model
        max_tokens: 600,
        system: `You are ScamShield AI for Pakistani users. Respond ONLY in valid JSON no markdown: {"verdict":"FAKE|REAL|UNCERTAIN","confidence":85,"summary":"2 sentence summary","red_flags":["flag1"],"safe_signs":["sign1"],"advice":"advice"}`,
        messages: [{ role: "user", content: `Analyze for scam (type: ${checkType}): "${query}"` }]
      })
    });

    const data = await response.json();
    
    // 2. Claude ka response text nikalna
    const rawText = data.content?.[0]?.text || "{}";
    const aiJson = JSON.parse(rawText.replace(/```json|```/g, "").trim());

    return NextResponse.json(aiJson);
  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}