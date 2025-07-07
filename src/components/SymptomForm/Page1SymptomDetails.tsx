"use client";

import { useState, useRef } from "react";
import Section1InitialAssessment from "./Section1InitialAssessment";
import Section2DietLifestyle from "./Section2DietLifestyle";
import Section3LifestyleHealthFactors from "./Section3LifestyleHealthFactors";
import Section4TriggersPatterns from "./Section4TriggersPatterns";
import Section5PreviousEfforts from "./Section5PreviousEfforts";

import { Progress } from "@/components/ui/progress";
import { FormDataType } from "@/types/form";
import { Button } from "@/components/ui/button";

type SectionRefHandle = {
  validate: () => boolean;
};

export default function Page1SymptomDetails() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    selectedSymptoms: [],
    otherSymptom: "",
    redFlags: [],

    duration: "",
    diagnoses: [],
    otherDiagnosis: "",
    dietType: "",
    fruitVegIntake: "",
    waterIntake: "",
    otherDiet: "",
    stressLevel: "",
    sleepHours: "",
    exerciseFrequency: "",
    foodTrigger: "",
    triggerFoodDetails: "",

    
    symptomPatterns: [],
    otherPattern: "",
    bowelFrequency: "",
    bowelConsistency: "",
    bowelColor: "",
    previousEfforts: [],
    otherEffort: "",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sectionRefs: Record<number, React.RefObject<SectionRefHandle | null>> = {
    1: useRef<SectionRefHandle>(null),
    2: useRef<SectionRefHandle>(null),
    3: useRef<SectionRefHandle>(null),
    4: useRef<SectionRefHandle>(null),
    5: useRef<SectionRefHandle>(null),
  };

  const sectionComponents: Record<number, React.ReactElement> = {
    1: <Section1InitialAssessment ref={sectionRefs[1]} data={formData} setData={setFormData} />,
    2: <Section2DietLifestyle ref={sectionRefs[2]} data={formData} setData={setFormData} />,
    3: <Section3LifestyleHealthFactors ref={sectionRefs[3]} data={formData} setData={setFormData} />,
    4: <Section4TriggersPatterns ref={sectionRefs[4]} data={formData} setData={setFormData} />,
    5: <Section5PreviousEfforts ref={sectionRefs[5]} data={formData} setData={setFormData} />,
  };

  const motivationalMessages = [
    "Let's get started!",
    "Bear with us, this is important.",
    "You're doing great, keep going!",
    "Almost there!",
    "Final step, you got this!",
  ];

  const handleNext = () => {
    const isValid = sectionRefs[currentStep]?.current?.validate?.();
    if (!isValid) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const isValid = sectionRefs[5]?.current?.validate?.();
    if (!isValid) return;

    setLoading(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const result = await res.json();
      localStorage.setItem("digestai_response", result.response);

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        window.location.href = "/results";
      }, 500);
    } catch (error) {
      clearInterval(interval);
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 text-center space-y-1">
        <p className="text-sm bg-black text-white inline-block px-3 py-1 rounded">
          Step {currentStep} of 5
        </p>
        <p className="text-xl font-semibold">
          {motivationalMessages[currentStep - 1]}
        </p>
      </div>

      {sectionComponents[currentStep]}

      <div className="mt-6 flex justify-between items-center">
        {currentStep > 1 && (
          <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
            Back
          </Button>
        )}

        {currentStep < 5 && (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}

        {currentStep === 5 && (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white"
          >
            {loading ? "Generating..." : "Submit"}
          </Button>
        )}
      </div>

      {loading && (
        <div className="mt-4">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-1">
            Generating your DigestAI report...
          </p>
        </div>
      )}
    </div>
  );
}
