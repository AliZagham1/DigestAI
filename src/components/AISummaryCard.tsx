"use client";

import { useEffect, useState } from "react";
import { SymptomReport } from "@/types/form";
import PatternCard from "./PatternCard";
import ImprovementCard from "./ImprovementCard";
import RiskAlertCard from "./RiskAlertCard";
import RecommendationCard from "./RecommendationCard";
import HealthScoreChart from "./HealthScoreChart";

type Props = {
  reports: SymptomReport[];
  userId: string;
};

type Summary = {
  pattern: { title: string; text: string; confidence: number };
  improvement: { title: string; text: string; confidence: number };
  risk: { title: string; text: string; confidence: number };
  recommendation: { title: string; text: string; confidence: number };
  scoreTrend: { date: string; score: number }[];
};

export default function AISummaryCard({ reports, userId }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reports.length || !userId) return;
    setLoading(true);
    setError(null);

    fetch("/api/ai-pattern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reports, userId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch summary");
        const data = await res.json();
        setSummary(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to generate AI insights. Please try again.");
        setLoading(false);
      });
  }, [reports, userId]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-black mb-4">AI Summary</h2>
      {loading && <div className="text-center py-8 text-gray-500">Generating AI insights…</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}
      {!loading && !error && summary && (
        <div className="space-y-6">
          <PatternCard {...summary.pattern} />
          <ImprovementCard {...summary.improvement} />
          <RiskAlertCard {...summary.risk} />
          <RecommendationCard {...summary.recommendation} />
          <HealthScoreChart data={summary.scoreTrend} />
        </div>
      )}
    </div>
  );
}
