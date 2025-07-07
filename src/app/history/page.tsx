"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

import { FormDataType } from "@/types/form";


export interface Submission {
  id: string;
  submitted_at: string;
  symptom_concerns: string[] | null;
  risk_level: string | null;
  ai_response: string | null;
  follow_up_chat: Record<string, unknown> | null; 
  confidence_score: number | null;
  user_id_text: string;
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

export default function HistoryPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [notesMap, setNotesMap] = useState<{ [id: string]: string  | undefined}>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("symptom_reports")
        .select("*")
        .eq("user_id_text", user.id)
        .order("submitted_at", { ascending: false });

      if (!error && data) setSubmissions(data);
      setLoading(false);
    };
    fetchData();
  }, [isLoaded, isSignedIn, user]);

  const handleNoteChange = (id : string, value: string) => {
    setNotesMap((prev) => ({ ...prev, [id]: value }));
  };

  const saveNote = async (entry: Submission) => {
    setSavingNoteId(entry.id);
    await supabase
      .from("symptom_reports")
      .update({ notes: notesMap[entry.id] })
      .eq("id", entry.id);
    setSavingNoteId(null);
    setNotesMap((prev) => ({ ...prev, [entry.id]: undefined }));
    
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === entry.id ? { ...sub, notes: notesMap[entry.id] || null } : sub
      )
    );
  };
  

  const markAsResolved = async (entry: Submission) => {
    setResolvingId(entry.id);
    await supabase
      .from("symptom_reports")
      .update({ Resolved: true }) 
      .eq("id", entry.id);
    
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === entry.id ? { ...sub, Resolved: true } : sub
      )
    );
    setResolvingId(null);
  };
  

  if (!isLoaded) return <p className="p-6">Checking session...</p>;
  if (!isSignedIn || !user) return <p className="p-6">Please sign in.</p>;
  if (loading) return <p className="p-6">Loading...</p>;
  if (submissions.length === 0) return <p className="p-6">No submissions found.</p>;

  return (
    <div className="p-4 space-y-2 bg-[#7265e3] min-h-screen">
      {submissions.map((entry) => (
        <div
          key={entry.id}
          className="bg-white rounded-2xl shadow p-4 flex flex-col space-y-2 relative"
        >
          {/* Top row: Risk & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Risk Badge */}
              <span
                className={`flex items-center gap-1 font-bold text-lg ${
                  entry.risk_level === "high"
                    ? "text-red-600"
                    : entry.risk_level === "moderate"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full inline-block mr-1 ${
                    entry.risk_level === "high"
                      ? "bg-red-500"
                      : entry.risk_level === "moderate"
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                />
                {entry.risk_level
                  ? entry.risk_level.charAt(0).toUpperCase() +
                    entry.risk_level.slice(1) +
                    " Risk"
                  : "Unknown Risk"}
              </span>
              {/* Status Pill */}
              <span
                className={`ml-2 text-xs px-3 py-1 rounded-full font-semibold ${
                  entry.Resolved
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {entry.Resolved ? "RESOLVED" : "ONGOING"}
              </span>
            </div>
            {/* Date/Time */}
            <span className="text-gray-500 text-sm">
              {entry.submitted_at ? formatDateTime(entry.submitted_at) : "Unknown"}
            </span>
          </div>

          {/* Confidence Score */}
          <div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Confidence Score</span>
              <span className="font-semibold text-gray-700">
                {entry.confidence_score ?? 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
              <div
                className={`h-3 rounded-full ${
                  entry.confidence_score?? 0 >= 80
                    ? "bg-green-500"
                    : entry.confidence_score ?? 0 >= 50
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${entry.confidence_score ?? 0}%`,
                  transition: "width 0.5s"
                }}
              />
            </div>
          </div>

          {/* Symptoms & Duration */}
          <div>
            <div className="font-bold text-lg text-gray-800 mb-1">Primary Symptoms</div>
            <div className="text-gray-700 text-base">
              {entry.symptom_concerns?.join(", ") || "Symptoms not listed"}
            </div>
            {entry.form_data?.duration && (
              <span className="mt-2 inline-block bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold">
                Duration: {entry.form_data?.duration}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap mt-2">
            <button
              onClick={() => router.push(`/submission/${entry.id}`)}
              className="bg-[#585be8] hover:bg-[#4c51c6] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              View Full Report
            </button>
            {/* Add Notes - expands textarea */}
            <div className="relative">
              <button
                onClick={() =>
                  setNotesMap((prev) => ({
                    ...prev,
                    [entry.id]:
                      prev[entry.id] !== undefined
                        ? undefined
                        : entry.notes || ""
                  }))
                }
                className="bg-white border-2 border-[#dbe1fa] text-[#585be8] font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#f4f6fd] transition"
              >
                Add Notes
              </button>
              {notesMap[entry.id] !== undefined && (
                <div className="absolute mt-2 left-0 w-72 bg-white p-4 rounded-xl shadow border z-20">
                  <textarea
                    rows={3}
                    value={notesMap[entry.id]}
                    onChange={(e) => handleNoteChange(entry.id, e.target.value)}
                    className="w-full border rounded p-2 mb-2"
                  />
                  <button
                    onClick={() => saveNote(entry)}
                    className="bg-[#585be8] text-white px-4 py-1 rounded"
                    disabled={savingNoteId === entry.id}
                  >
                    {savingNoteId === entry.id ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() =>
                      setNotesMap((prev) => ({ ...prev, [entry.id]: undefined }))
                    }
                    className="ml-2 text-sm text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {/* Resolved Button */}
            <button
              onClick={() => !entry.Resolved && markAsResolved(entry)}
              disabled={entry.Resolved || resolvingId === entry.id}
              className={`font-semibold px-6 py-2 rounded-lg shadow transition
                ${
                  entry.Resolved
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-white border-2 border-[#dbe1fa] text-[#585be8] hover:bg-green-100"
                }
              `}
            >
              {entry.Resolved
                ? "Resolved"
                : resolvingId === entry.id
                ? "Marking..."
                : "Mark as Resolved"}
            </button>
          </div>

          {/* If a note is present, show it at the bottom */}
          {entry.notes && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl mt-3 p-3">
              <span className="text-sm text-gray-600">Note: {entry.notes}</span>
            </div>
          )}

          {/* Optional: expand/collapse icon in the corner */}
          <span className="absolute bottom-3 right-6 text-black opacity-70 select-none">▼</span>
        </div>
      ))}
    </div>
  );
}
