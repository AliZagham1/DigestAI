import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: Request) {
  const { question, context } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are DigestAI, a gut health assistant. Always respond based on the user's prior assessment and offer safe, responsible advice. Do not suggest the OTC medicines if the risk level is high or the response has redFlages. Do not suggest OTC medicines even if the user insists. you can use emojis where necessary ",
        
      },
      {
        role: "user",
        content: `Here's what the user previously received:\n${context}`,
      },
      {
        role: "user",
        content: `Follow-up Question: ${question}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0.2,
    presence_penalty: 0,

  });

  const answer = completion.choices[0]?.message?.content ?? "No response generated.";
  return NextResponse.json({ answer });
}
