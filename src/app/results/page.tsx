"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

import { extractFlags } from "@/lib/analyzeFlags";

import PreviousEffortsCards from "@/components/PreviousEffortsCards";


export default function ResultsPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  const [response, setResponse] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<string>("unknown");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);


  useEffect(() => {
    const fetchReport = async () => {
      if (!isLoaded) return;
      if (!isSignedIn || !user) return;

      const { data, error } = await supabase
        .from("symptom_reports")
        .select("ai_response, risk_level, form_data")
        .eq("user_id_text", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();

       

      if (error || !data) {
        const local = localStorage.getItem("digestai_response");
        if (local) {
          setResponse(local);
          const riskBody = local.toLowerCase();
          if (riskBody.includes("high")) setRiskLevel("high");
          else if (riskBody.includes("moderate")) setRiskLevel("moderate");
          else if (riskBody.includes("low")) setRiskLevel("low");
        }
      } else {
        setResponse(data.ai_response);
        setRiskLevel(data.risk_level || "unknown");

        if (data?.form_data) {
          setFormData(typeof data.form_data === "string"
            ? JSON.parse(data.form_data)
            : data.form_data
          );
        } else {
          setFormData(null);
        }
        
      }

      setLoading(false);
    };

    fetchReport();
  }, [isLoaded, isSignedIn, user]);

  const defaultFlags = {
    lowWater: false,
    lowFiber: false,
    highStress: false,
    longDuration: false,
    hasRedFlags: false,
    noEffortsTried: false,
    alreadyTriedSupplements: false,
    lowSleep: false,
     lowExercises: false
  };

   const flags = formData ? extractFlags(formData) : defaultFlags;


   // Prepare flag cards
   const flagCards = [
    flags.lowWater && { label: "Low Water Intake", color: "bg-blue-200", icon: "💧" },
    flags.lowFiber && { label: "Low Fiber/Fruit/Veg", color: "bg-yellow-200", icon: "🥬" },
    flags.highStress && { label: "High Stress", color: "bg-red-200", icon: "😰" },
    flags.longDuration && { label: "Long Symptom Duration", color: "bg-purple-200", icon: "⏳" },
    flags.hasRedFlags && { label: "Red Flags Present", color: "bg-pink-200", icon: "🚩" },
    flags.lowSleep && { label: "Low Sleep", color: "bg-orange-200", icon: "💤" },
    flags.lowExercises && { label: "Low Exercise", color: "bg-teal-200", icon: "🏃‍♂️" }
  ].filter(Boolean) as { label: string; color: string; icon: string }[];

  if (!isLoaded) return <p className="p-4">Checking session...</p>;
  if (!isSignedIn || !user) {
    return (
      <div className="p-4">
        <h2>Please sign in to view your report.</h2>
      </div>
    );
  }

  if (loading) return <p className="p-4">Loading your report...</p>;

  if (!response) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-xl font-semibold">No report found</h1>
        <p>Please complete the assessment first.</p>
      </div>
    );
  }

  

  const sections = response
    .split("## ")
    .filter(Boolean)
    .map((block) => {
      const [title, ...rest] = block.trim().split("\n");
      return {
        title: title.trim(),
        body: rest.join("\n").trim(),
      };
    })
    .filter((section => section.title.toLowerCase() !== "confidence score"));

    console.log("Section Titles:", sections.map(s => s.title));

    

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold mb-4 text-center">DigestAI Report</h1>
           

      {riskLevel !== "unknown" && (
        <div
          className={`p-3 text-sm font-medium rounded-lg mb-4 text-white ${
            riskLevel === "high"
              ? "bg-red-600"
              : riskLevel === "moderate"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          {riskLevel === "high" && "⚠️ High risk detected. Please consult a healthcare provider soon."}
          {riskLevel === "moderate" && "⚠️ Moderate risk detected. Monitoring and self-care recommended."}
          {riskLevel === "low" && "✅ Low risk based on your inputs."}
        </div>
      )}



      {sections.map((section, index) => (
        <div
          key={index}
          className="p-4 rounded-lg shadow bg-white border border-gray-200"
        >
          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
          <p className="whitespace-pre-line text-gray-800">
            {section.body.replace(/\*\*/g, "")}
          </p>
        </div>
      ))}

      <PreviousEffortsCards previousEfforts={formData?.previousEfforts}  otherEffort={formData?.otherEffort}/>
<h1 className ="text-3xl font-bold mb-4 text-center"> Flag Cards</h1>
   {flagCards.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {flagCards.map((flag, idx) => (
            <div
              key={idx}
              className={`flex items-center px-4 py-2 rounded-xl shadow font-semibold text-base sm:text-lg ${flag.color}`}
            >
              <span className="mr-2 text-xl">{flag.icon}</span>
              {flag.label}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
        <Button
          variant="default"
          onClick={() => {
            localStorage.removeItem("digestai_response");
            router.push("/input/page1");
          }}
        >
          🔁 Start Over
        </Button>

        <Button variant="outline" onClick={() => router.push("/follow-up")}>
          💬 Ask DigestAI a Follow-Up
        </Button>
      </div>
    </div>
  );
}
