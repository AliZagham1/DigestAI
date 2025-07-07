import { AlertTriangleIcon } from "lucide-react";

export default function RiskAlertCard({
  title,
  text,
  confidence,
}: {
  title: string;
  text: string;
  confidence: number;
}) {
  return (
    <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-6 shadow">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangleIcon className="w-6 h-6 text-orange-700" />
        <h2 className="text-xl font-bold text-orange-700">{title}</h2>
      </div>
      <div className="text-lg text-orange-900 mb-2">{text}</div>
      <div className="text-orange-700 font-medium">Confidence: {confidence}%</div>
    </div>
  );
}
