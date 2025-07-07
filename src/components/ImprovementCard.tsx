import { TrendingUpIcon } from "lucide-react";

export default function ImprovementCard({
  title,
  text,
  confidence,
}: {
  title: string;
  text: string;
  confidence: number;
}) {
  return (
    <div className="rounded-2xl bg-green-50 border border-green-200 p-6 shadow">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUpIcon className="w-6 h-6 text-green-700" />
        <h2 className="text-xl font-bold text-green-700">{title}</h2>
      </div>
      <div className="text-lg text-green-900 mb-2">{text}</div>
      <div className="text-green-700 font-medium">Confidence: {confidence}%</div>
    </div>
  );
}
