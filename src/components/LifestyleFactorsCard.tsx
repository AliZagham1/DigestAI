import {
    parseSleepHours,
    mapStressLevel,
    mapExerciseFreq,
    mapDietQuality,
    average,
  } from "@/lib/lifestyle";
  import { SymptomReport } from "@/types/form";
  import { TargetIcon } from "lucide-react";
  
  
  type LifestyleFactor = {
    label: string;
    current: number;
   
  };
  
  
  
  interface Props {
    reports: SymptomReport[];
  }
  
  export default function LifestyleFactorsCard({ reports }: Props) {
    // Compute averages from reports
    const sleepScores = reports.map(r => parseSleepHours(r.form_data.sleepHours));
    const avgSleep = average(sleepScores);
  
    const stressScores = reports.map(r => mapStressLevel(r.form_data.stressLevel));
    const avgStress = average(stressScores);
  
    const exerciseScores = reports.map(r => mapExerciseFreq(r.form_data.exerciseFrequency));
    const avgExercise = average(exerciseScores);
  
    const dietScores = reports.map(r =>
      mapDietQuality(r.form_data.fruitVegIntake, r.form_data.waterIntake)
    );
    const avgDiet = average(dietScores);
  
    
    const lifestyleData: LifestyleFactor[] = [
      { label: "Sleep Quality", current: avgSleep,   },
      { label: "Stress Level", current: avgStress,  },
      { label: "Exercise", current: avgExercise,  },
      { label: "Diet Quality", current: avgDiet, },
    ];
  
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg mx-auto mb-6">
        {/* Card Header */}
        <div className="flex items-center mb-6">
          <TargetIcon className="text-purple-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-black">Lifestyle Factors</h2>
      
        </div>
        <h3 className="text-sm text-gray-400 ml-auto pb-3">
          Each bar shows your average score (out of 10)
            
          </h3>
        <div className="flex flex-col gap-6">
          {lifestyleData.map((factor) => (
            <LifestyleFactorRow key={factor.label} {...factor} />
          ))}
        </div>
      </div>
    );
  }
  
  function LifestyleFactorRow({
    label,
    current,
    
  }: LifestyleFactor) {
    const percent = Math.round((current / 10) * 100);
    const barColor = label === "Stress Level" ? "bg-red-500" : "bg-purple-500";
    
   
  
    return (
      <div className="bg-gray-50 rounded-2xl p-4 shadow flex flex-col gap-2  ">
        {/* Row 1: Label + Status */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-semibold">{label} </div>
            <div className="text-sm text-gray-400">Current</div>
          </div>
         
        </div>
        {/* Row 2: Progress Bar + Score */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <div className="relative w-full h-2 rounded-lg bg-gray-200">
              <div className = {`absolute left-0 top-0 h-2 rounded-lg ${barColor}`} style ={{width: `${percent}%`}}>

              </div>
             
            </div>
          </div>
          <div className="text-lg font-bold ml-2">
            {current}/10
          </div>
        </div>
      
      </div>
    );
  }
  