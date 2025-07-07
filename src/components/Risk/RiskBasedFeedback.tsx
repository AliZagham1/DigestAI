import React from "react";

type RiskLevel = "high" | "moderate" | "low";

type RiskBasedFeedbackProps = {
  params: Record<string, string>;
  message: string;
  causes: string;
  otc: string;
  suggestions: string;
};

function assessRisk(params: Record<string, string>): RiskLevel {
  const hasRedFlags = params.redFlags && params.redFlags.trim() !== "";
  const longDuration =
    params.duration?.includes("More than 2 weeks") ||
    params.duration?.includes("1-2 weeks");
  const highSeverity = parseInt(params.severity || "0", 10) >= 7;

  if (hasRedFlags || highSeverity) {
    return "high";
  } else if (longDuration) {
    return "moderate";
  } else {
    return "low";
  }
}

export default function RiskBasedFeedback({
  params,
  message,
  causes,
  otc,
  suggestions,
}: RiskBasedFeedbackProps) {
  const riskLevel = assessRisk(params);

  const riskMessages = {
    high: "🚨 Serious symptoms detected. Please seek immediate medical attention.",
    moderate:
      "⚠️ Your symptoms have lasted longer than usual. Please consider consulting a healthcare provider soon.",
    low: "✅ Your symptoms appear minor. Monitor your condition and follow the suggested advice.",
  };

  return (
    <div className="space-y-4">
      {/* User Summary */}
      <div className="border p-4 rounded shadow-sm bg-white">
        <h2 className="font-semibold mb-2">What You Reported</h2>
        <p>Symptoms: {params.symptoms}</p>
        <p>Duration: {params.duration}</p>
        <p>Red Flags: {params.redFlags || "None"}</p>
        <p>Severity: {params.severity}</p>
        <p>Onset: {params.onsetTiming}</p>
        <p>Usual Food: {params.usualFood}</p>
        <p>Today’s Food: {params.todayFood}</p>
        <p>Medical Conditions: {params.medicalConditions || "None"}</p>
        <p>Medications: {params.medicationNames || "None"}</p>
      </div>

      {/* Risk Alert */}
      <div
        className={`p-4 rounded ${
          riskLevel === "high"
            ? "bg-red-100 border border-red-400 text-red-700"
            : riskLevel === "moderate"
            ? "bg-yellow-100 border border-yellow-400 text-yellow-700"
            : "bg-green-100 border border-green-400 text-green-700"
        }`}
      >
        {riskMessages[riskLevel]}
      </div>

      {/* Show Self-Care Sections Only for Moderate or Low Risk */}
      {riskLevel !== "high" && (
        <>
          {/* AI Health Insight */}
          <div className="border p-4 rounded shadow-sm bg-white max-h-60 overflow-y-auto">
            <h2 className="font-semibold mb-2">AI Health Insight</h2>
            <p>{message || "No insights available."}</p>
          </div>

          {/* What This Might Mean for You */}
          <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="font-semibold mb-2">What This Might Mean for You</h2>
            <p>{causes || "No specific causes identified."}</p>
          </div>

          {/* What You Can Try for Relief */}
          <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="font-semibold mb-2">What You Can Try for Relief</h2>
            <p>{otc || "No specific OTC suggestions available."}</p>
          </div>

          {/* Small Changes That Might Help You Feel Better */}
          <div className="border p-4 rounded shadow-sm bg-white">
            <h2 className="font-semibold mb-2">
              Small Changes That Might Help You Feel Better
            </h2>
            <p>{suggestions || "No specific lifestyle suggestions available."}</p>
          </div>
        </>
      )}

      {/* Doctor Questions Section (Always Shown) */}
      <div className="border p-4 rounded shadow-sm bg-white">
        <h2 className="font-semibold mb-2">
          Questions to Discuss With Your Doctor
        </h2>
        <ul className="list-disc pl-5">
          <li>What could be causing these symptoms?</li>
          <li>Are there any tests I should consider?</li>
          <li>Is this related to my existing medical conditions or medications?</li>
          <li>What should I monitor or avoid until I get checked?</li>
        </ul>
      </div>

      {/* Disclaimer Section */}
      <div className="text-sm text-gray-500 border-t pt-4 pb-10">
        ⚠️ Disclaimer: DigestAI offers AI-powered health insights based on your
        input but does not replace professional medical advice. Please contact a
        healthcare provider if you have serious concerns.
      </div>
    </div>
  );
}
