import { SymptomReport } from "@/types/form";



// Helper to parse "7-8" as 7.5, "6-8" as 7, etc.
export function parseSleepHours(sleep: string): number {
    switch (sleep) {
        case "Less than 5":
          return 2;    // very low sleep = bad score
        case "5-6":
          return 4;    // moderate
        case "7-8":
          return 8;    // recommended
        case "More than 8":
          return 10;   // excellent!
        default:
          return 4;    // unknown = neutral/below average
      }
}

// Low stress is better, so "Low" = 4, "Moderate" = 7, "High" = 10 (on a 10 scale)
export function mapStressLevel(level: string): number {
  switch (level?.toLowerCase()) {
    case "low":
      return 4;
    case "moderate":
      return 7;
    case "high":
      return 10;
    default:
      return 7;
  }
}

export function mapExerciseFreq(freq: string): number {
  switch (freq?.toLowerCase()) {
    case "none":
      return 0;
    case "1-2 times/week":
      return 3;
    case "3-5 times/week":
      return 6;
    case "daily":
      return 10;
    default:
      return 4;
  }
}

export function mapDietQuality(fruitVeg: string, water: string): number {
  let score = 0;
  if (fruitVeg === "0-1") score += 2;
  else if (fruitVeg === "2-3") score += 4;
  else if (fruitVeg === "4-5") score += 6;
  else if (fruitVeg === "6+") score += 8;
  // Water intake: numeric or string like "6-8"
  let waterNum = 0;
  if (typeof water === "string") {
    const nums = water.match(/\d+/g)?.map(Number);
    waterNum = nums ? (nums.length === 2 ? (nums[0] + nums[1]) / 2 : nums[0]) : 0;
  } else {
    waterNum = water as unknown as number;
  }
  score += waterNum >= 8 ? 5 : waterNum >= 6 ? 3 : 1;
  return Math.min(10, Math.round((score / 13) * 10));
}

export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
}
