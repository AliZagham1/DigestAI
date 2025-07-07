import { FormDataType } from "@/types/form";

export function extractFlags(data: FormDataType) {
  const LOW_FRUIT_OPTIONS = ["0-1", "2-3"];
  const LOW_WATER_OPTIONS = ["Less than 2", "2-3"];
  const LOW_SLEEP_OPTIONS = ["Less than 5", "5-6"];
  const LOW_EXERCISE_OPTIONS = ["Rarely", "Never"];
  return {
    lowWater: LOW_WATER_OPTIONS.includes(data.waterIntake),
    lowFiber: LOW_FRUIT_OPTIONS.includes(data.fruitVegIntake),
    highStress: ["High", "Very high"].includes(data.stressLevel),
    longDuration: data.duration === "More than 6 months",
    hasRedFlags: data.redFlags.length > 0 && !data.redFlags.includes("None"),
    lowSleep: LOW_SLEEP_OPTIONS.includes(data.sleepHours ) ,
    lowExercises: LOW_EXERCISE_OPTIONS.includes(data.exerciseFrequency),

  };
}
