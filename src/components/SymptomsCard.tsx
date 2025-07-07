import React from "react";
import { SymptomReport } from "@/types/form";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";


const SYMPTOMS = [
  "Headache", "Fatigue", "Stomach Pain", "Dizziness", "Nausea", "Chest Pain",
  "Bloating", "Gas", "Constipation", "Diarrhea", "Other"
];

type Props = {
  reports: SymptomReport[];
};

export default function SymptomsCard({ reports }: Props) {
  // Count occurrences for each symptom
  const symptomCounts: Record<string, number> = {};
  SYMPTOMS.forEach(sym => (symptomCounts[sym] = 0));
  let totalMentions = 0;

  for (const report of reports) {
    const { selectedSymptoms = [], otherSymptom = "" } = report.form_data;
    selectedSymptoms.forEach(sym => {
      const key = SYMPTOMS.includes(sym) ? sym : "Other";
      symptomCounts[key] += 1;
      totalMentions += 1;
    });
    // Count "Other" custom text even if not selected
    if (otherSymptom && !selectedSymptoms.includes("Other")) {
      symptomCounts["Other"] += 1;
      totalMentions += 1;
    }
  }

  // Prepare data for display
  const displaySymptoms = SYMPTOMS
    .map(sym => ({
      name: sym,
      count: symptomCounts[sym],
      percent: totalMentions ? +(symptomCounts[sym] / totalMentions * 100).toFixed(1) : 0,
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

// Count frequency for each custom 'Other' symptom
const customOtherCounts: Record<string, number> = {};

for (const report of reports) {
  const custom = report.form_data.otherSymptom?.trim();
  if (custom) {
    if (customOtherCounts[custom]) {
      customOtherCounts[custom] += 1;
    } else {
      customOtherCounts[custom] = 1;
    }
  }
}

const customOtherList = Object.entries(customOtherCounts)
  .sort((a, b) => b[1] - a[1]); // sort by count descending


 

  if (displaySymptoms.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 text-center text-gray-400">
        No symptom history yet.
      </div>
    );
  }

  const chartData = displaySymptoms.map(({ name, count }) => ({
    name,
    count,
  }));
  

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Symptom Reporting History</h2>
      <div className="space-y-4">
        {displaySymptoms.map(({ name, count, percent }) => (
          <div key={name}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{name}</span>
              <span className="text-sm text-gray-500">
                {count} time{count > 1 ? "s" : ""} ({percent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${percent}%`,
                  background:
                    percent >= 40 ? "#ef4444" : percent >= 20 ? "#f59e42" : "#22c55e",
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>
        ))}
      </div>

  
   {customOtherList.length > 0 && (  // Check if there are any custom 'Other' symptoms
   <div className="mt-6">
    <div className="text-sm font-semibold text-gray-600 mb-1">Custom symptoms you entered:</div>
    <ul className="list-disc pl-6 text-sm text-gray-500">
      {customOtherList.map(([text, count], idx) => (
        <li key={idx}>
          {text} <span className="ml-2 text-gray-400">({count} time{count > 1 ? "s" : ""})</span>
        </li>
      ))}
    </ul>
  </div>
)}
 {chartData.length > 0 && (
  <div className="w-full h-64 mt-8">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}


      
    </div>
  );
}
