import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

import { SymptomReport } from "@/types/form";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { reports, userId } = await req.json();

    // Fetch cached summary
    const { data: summaryRow } = await supabase
  .from("ai_summaries")
  .select("*")
  .eq("user_id_text", userId)
  .single();


    const latestReportDate = reports.length ? new Date(reports[reports.length - 1].submitted_at) : null;
    console.log("Cached summary reports_used_at_gen:", summaryRow?.reports_used_at_gen);
    console.log("Latest report submitted_at:", reports.length ? reports[reports.length - 1].submitted_at : "NO REPORTS");
    console.log("Latest report date object:", latestReportDate);

 if (summaryRow && summaryRow.reports_used_at_gen && latestReportDate) {
  const cachedDate = new Date(summaryRow.reports_used_at_gen);
  
  console.log("Comparing dates:");
  console.log("Cached date:", cachedDate);
  console.log("Latest report date:", latestReportDate);
  console.log("Cached >= Latest?", cachedDate >= latestReportDate);
  
  // If cached summary was generated with data that includes the latest report
  if (cachedDate >= latestReportDate) {
    console.log("Using cached summary");
    return NextResponse.json(summaryRow.summary_json); 
  }
}

console.log("No cached summary found or report is newer. Generating new summary...");

   
    const prompt = `
You are a professional AI health assistant. Analyze the following user's gut health reports and produce:

1. A short plain-language summary of key patterns you observe (trends, correlations, symptom frequency, etc).
2. An improvement trend (has the user improved, worsened, or stayed the same?).
3. Any risk factor alerts (are there red flags or concerning trends?).
4. A practical recommendation (what can the user do next?).
5. Assign a confidence score (as a percentage) for each section, based on the amount and clarity of data.
6. Also, return a list of overall health scores over time if you can infer them.

Format your response as a JSON object like this:

{
  "pattern": { "title": "...", "text": "...", "confidence": 0 },
  "improvement": { "title": "...", "text": "...", "confidence": 0 },
  "risk": { "title": "...", "text": "...", "confidence": 0 },
  "recommendation": { "title": "...", "text": "...", "confidence": 0 },
  "scoreTrend": [ { "date": "2023-10-01", "score": 80 }, ... ]
}

Here is the user's data:
${reports
  .map(
    (r : SymptomReport, i : number) =>
      `\nReport ${i + 1} (${r.submitted_at}):\n` +
      Object.entries(r.form_data)
        .map(([key, val]) => `- ${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
        .join("\n")
  )
  .join("\n")}
`;

    //OpenAI API call 
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert medical assistant helping users understand their health reports in detail, using clear and safe language.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }, 
    });

    const aiText = aiResponse.choices[0]?.message?.content || "";
    let parsedSummary;
    try {
      parsedSummary = JSON.parse(aiText);
    } catch {
      throw new Error("AI response is not valid JSON");
    }

    // Store in Supabase 
    await supabase.from("ai_summaries").upsert({
      user_id_text: userId,
      summary_json: parsedSummary,
      updated_at: new Date().toISOString(),
      reports_used_at_gen: latestReportDate ? latestReportDate.toISOString() : null,
    },
    );

    return NextResponse.json(parsedSummary);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI summary generation failed." }, { status: 500 });
  }
}
