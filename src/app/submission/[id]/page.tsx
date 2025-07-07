"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FormDataType } from "@/types/form";
import ReactMarkdown from "react-markdown"; // run `npm i react-markdown` if you haven't

export interface Submission {
  id: string;
  submitted_at: string;
  risk_level: string | null;
  ai_response: string | null;
  confidence_score: number | null;
  form_data: FormDataType | null;
  notes: string | null;
  Resolved: boolean | null;
}

function formatDateTime(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// --- Core parsing utility ---
function parseSections(aiResponse: string | null) {
  if (!aiResponse) return [];
  const sections = aiResponse.split(/\n## /g);
  return sections.filter(s => s.trim() !== "").map(section => {
    const lines = section.split("\n");
    const title = lines[0].replace(/^[#\s]*/, "");
    const content = lines.slice(1).join("\n").trim();
    return { title, content };
  });
}

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchSubmission = async () => {
      const { data, error } = await supabase
        .from("symptom_reports")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        router.push("/history");
        return;
      }
      setData(data);
      setLoading(false);
    };
    fetchSubmission();
  }, [id, router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">Submission not found.</div>;

  const sections = parseSections(data.ai_response);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Health Assessment Report</h1>
        <div className="text-gray-500 text-sm">
          {formatDateTime(data.submitted_at)}
        </div>
        <div className="text-xs text-blue-500">Assessment ID: {data.id.slice(-8)}</div>
      </div>

      {/* Risk/Confidence Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className={`font-semibold px-4 py-2 rounded-lg text-lg
          ${data.risk_level === "high" ? "bg-red-100 text-red-700"
            : data.risk_level === "moderate" ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
          }`}>
          {data.risk_level
            ? data.risk_level.charAt(0).toUpperCase() + data.risk_level.slice(1) + " Risk"
            : "Unknown Risk"}
        </div>
        <div className="flex-1">
          <div className="font-medium mb-1">Confidence Score <span className="font-bold">{data.confidence_score ?? 0}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${data.confidence_score ?? 0 >= 80 ? "bg-green-500" : data.confidence_score ?? 0 >= 50 ? "bg-yellow-400" : "bg-red-500"}`}
              style={{ width: `${data.confidence_score ?? 0}%`, transition: "width 0.5s" }}
            />
          </div>
        </div>
      </div>

      {/* Parsed AI Sections */}
      <div className="space-y-6">
        {sections.map(({ title, content }) => (
          <div
            key={title}
            className={`rounded-xl p-4 border
              ${title.toLowerCase().includes("risk") ? "bg-red-50 border-red-200"
                : title.toLowerCase().includes("health insight") ? "bg-blue-50 border-blue-100"
                : title.toLowerCase().includes("contributing factors") ? "bg-yellow-50 border-yellow-100"
                : title.toLowerCase().includes("recommendations") ? "bg-green-50 border-green-100"
                : title.toLowerCase().includes("doctor") ? "bg-violet-50 border-violet-100"
                : title.toLowerCase().includes("input summary") ? "bg-gray-50 border-gray-200"
                : "bg-white border-gray-100"
              }`}
          >
            <div className="font-bold text-lg mb-2">{title}</div>
            {/* Render markdown for formatting */}
            <div>
              <ReactMarkdown>{content}</ReactMarkdown>
              </div>
          
          </div>
        ))}
      </div>

  

      {/* Show notes and resolved status if present */}
      <div className="flex flex-col gap-2">
        {data.notes && (
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-sm">
            <span className="font-semibold">Note:</span> {data.notes}
          </div>
        )}
        <div>
          <span className={`px-3 py-1 rounded-full font-semibold text-xs 
            ${data.Resolved ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {data.Resolved ? "RESOLVED" : "ONGOING"}
          </span>
        </div>
      </div>
    </div>
  );
}
