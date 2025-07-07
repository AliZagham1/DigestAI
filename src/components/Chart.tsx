import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

import { SymptomReport } from "@/types/form";



interface RiskCounts {
  low: number;
  moderate: number;
  high: number;
}

interface ChartDatum {
  name: string;
  value: number;
}

interface RiskColorLabel {
  level: "low" | "moderate" | "high";
  label: string;
  color: string;
}

const RISK_LEVELS: RiskColorLabel[] = [
  { level: "low", label: "Low Risk", color: "#4CAF50" },
  { level: "moderate", label: "Moderate Risk", color: "#FFA726" },
  { level: "high", label: "High Risk", color: "#F44336" }
];

export default function RiskLevelDistributionCard({ reports }: { reports: SymptomReport[] }) {
 
  const riskCounts: RiskCounts = { low: 0, moderate: 0, high: 0 };
  reports.forEach((report) => {
    
   type RiskLevel = "low" | "moderate" | "high";
   const risk = report.risk_level?.toLowerCase() as RiskLevel;
   if (risk === "low" || risk === "moderate" || risk === "high") {
   riskCounts[risk]++;
}
  });

  
  const chartData: ChartDatum[] = RISK_LEVELS.map(({ label, level }) => ({
    name: label,
    value: riskCounts[level],
  }));

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 max-w-3xl mx-auto mb-8">
      <div className="flex items-center mb-6">
        <AlertTriangle className="text-orange-500 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-black">Risk Level Distribution</h2>
      </div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={270}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              stroke="none"
              paddingAngle={3}
            >
              {RISK_LEVELS.map((level, idx) => (
                <Cell key={level.level} fill={level.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

       
        <div className="flex justify-center mt-4 gap-10">
          {RISK_LEVELS.map((level) => (
            <LegendDot key={level.level} color={level.color} label={level.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="rounded-full"
        style={{
          display: "inline-block",
          width: "14px",
          height: "14px",
          backgroundColor: color,
        }}
      />
      <span className="text-gray-600 text-base">{label}</span>
    </div>
  );
}
