

import { BrainIcon } from "lucide-react";

export default function PatternCard({
  title,
  text,
  confidence,
}: {
  title: string;
  text: string;
  confidence: number;
}) {
  return (
    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 shadow">
      <div className="flex items-center gap-2 mb-2">
        <BrainIcon className="w-6 h-6 text-blue-700" />
        <h2 className="text-xl font-bold text-blue-700">{title}</h2>
      </div>
      <div className="text-lg text-blue-800 mb-2">{text}</div>
      <div className="text-blue-700 font-medium">Confidence: {confidence}%</div>
    </div>
  );
}
