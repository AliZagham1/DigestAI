import { TargetIcon } from "lucide-react";

export default function RecommendationCard({
  title,
  text,
  confidence,
}: {
  title: string;
  text: string;
  confidence: number;
}) {
  return (
    <div className="rounded-2xl bg-purple-50 border border-purple-200 p-6 shadow">
      <div className="flex items-center gap-2 mb-2">
        <TargetIcon className="w-6 h-6 text-purple-700" />
        <h2 className="text-xl font-bold text-purple-700">{title}</h2>
      </div>
      <div className="text-lg text-purple-900 mb-2">{text}</div>
      <div className="text-purple-700 font-medium">Confidence: {confidence}%</div>
    </div>
  );
}
