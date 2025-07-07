

type PreviousEffortsCardsProps = {
    previousEfforts: string[] | undefined;
    otherEffort?: string ;
  };
  
  const previousEffortOptions: Record<string, { label: string; color: string; icon: string }> = {
    "Dietary changes":    { label: "Tried Dietary Changes", color: "bg-amber-200", icon: "🥗" },
    "Stress management":  { label: "Tried Stress Management", color: "bg-purple-200", icon: "🧘" },
    "Sleep improvement":  { label: "Tried Sleep Improvement", color: "bg-blue-200", icon: "😴" },
    "Hydration":          { label: "Tried Hydration", color: "bg-cyan-200", icon: "💧" },
    "Supplements":        { label: "Tried Supplements", color: "bg-green-200", icon: "💊" },
    "Medical treatments": { label: "Tried Medical Treatments", color: "bg-red-200", icon: "🏥" },
    
  };
  
  export default function PreviousEffortsCards({ previousEfforts, otherEffort }: PreviousEffortsCardsProps) {
    const effortFlagCards = (previousEfforts || [])
    .map(effort => {
      if (effort === "Other" && otherEffort) {
        return {
          label: `Tried Other Effort: ${otherEffort}`,
          color: "bg-gray-200",
          icon: "✨",
        };
      }
      return previousEffortOptions[effort];
    })
    .filter(Boolean);
    if (effortFlagCards.length === 0) return null;
  
    return (
      <div>
        <h2 className="text-3xl font-bold mb-4 text-center">
          What You've Already Tried
        </h2>
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {effortFlagCards.map((flag, idx) => (
            <div
              key={idx}
              className={`flex items-center px-6 py-2 rounded-full shadow font-semibold text-base sm:text-lg ${flag.color} border border-gray-200`}
            >
              <span className="mr-2 text-xl">{flag.icon}</span>
              {flag.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
  