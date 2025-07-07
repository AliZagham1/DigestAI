export type FormDataType = {
    selectedSymptoms: string[];
    otherSymptom: string;
    redFlags: string[];
    duration: string;
    diagnoses: string[];
    otherDiagnosis: string;
  
    dietType: string;
    fruitVegIntake: string;
    waterIntake: string;
    otherDiet: string;
  
    stressLevel: string;
    sleepHours: string;
    exerciseFrequency: string;
  
    foodTrigger: string;
    triggerFoodDetails: string;

    symptomPatterns: string[];
    otherPattern: string;
    bowelFrequency: string;
    bowelConsistency: string;
    bowelColor: string;
  
    previousEfforts: string[];
    otherEffort: string;
  };
  
  
export type SymptomReport = {
  id: string;
  submitted_at: string;
  risk_level: string;
  confidence_score: number;
  form_data: FormDataType;
};
