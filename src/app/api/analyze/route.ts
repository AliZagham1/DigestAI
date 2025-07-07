import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generatePrompt } from '@/lib/generatePrompt';
import { extractFlags } from '@/lib/analyzeFlags';
import { FormDataType } from '@/types/form';

import { supabase } from "@/lib/supabaseClient";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData: FormDataType = body.data;

    // 🧠 Step 1: Extract flags
    const flags = extractFlags(formData);

    // 🧾 Step 2: Generate prompt
    const prompt = generatePrompt(formData, flags);

    // 🤖 Step 3: Request completion from GPT-4-Turbo
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are DigestAI, a medically responsible gut health assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = aiResponse.choices[0].message.content || "";

    
    const riskMatch = responseText.match(/risk level[:\-]?\s*(high|moderate|low)/i);
    const riskLevel = riskMatch ? riskMatch[1].toLowerCase() : "unknown";

    
    const scoreMatch = responseText.match(/confidence score[:\-]?\s*(\d{1,3})/i);
    const confidenceScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

    
    const cleanResponse = responseText
      .replace(/risk level[:\-]?\s*(high|moderate|low)\s*/i, "")
      .replace(/confidence score[:\-]?\s*\d{1,3}\s*/i, "")
      .trim();

    const { userId } = await auth();
    console.log("UserId:", userId);

   
    const { error } = await supabase.from("symptom_reports").insert([
      {
        user_id_text: userId,
        form_data: formData,
        symptom_concerns: formData.selectedSymptoms,
        risk_level: riskLevel,
        confidence_score: confidenceScore,
        ai_response: cleanResponse, // Only the user-facing report
        follow_up_chat: null
      }
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: "Failed to store report" }, { status: 500 });
    }

    
    return NextResponse.json({ response: cleanResponse });

  } catch (error) {
    console.error("DigestAI Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
