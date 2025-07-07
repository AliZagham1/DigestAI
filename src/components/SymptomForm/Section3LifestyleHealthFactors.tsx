"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FormDataType } from "@/types/form";

type Props = {
  data: FormDataType;
  setData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

type SectionRefHandle = {
  validate: () => boolean;
};

const Section3LifestyleHealthFactors = forwardRef<SectionRefHandle, Props>(
  ({ data, setData }, ref) => {
    const [error, setError] = useState("");

    const validate = () => {
      if (
        data.stressLevel === "" ||
        data.sleepHours === "" ||
        data.exerciseFrequency === ""
      ) {
        setError("Please complete all required fields.");
        return false;
      }
      setError("");
      return true;
    };

    useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Section 3: Lifestyle & Health Factors</h2>
        {error && <p className="text-red-600">{error}</p>}

        {/* Stress Level */}
        <div className="p-4 bg-gray-50 rounded shadow">
          <p>How would you rate your typical stress level?</p>
          {["Very low", "Low", "Moderate", "High", "Very high"].map((level) => (
            <label key={level} className="block">
              <input
                type="radio"
                name="stressLevel"
                value={level}
                checked={data.stressLevel === level}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, stressLevel: e.target.value }))
                }
                className="mr-2"
              />
              {level}
            </label>
          ))}
        </div>

        {/* Sleep Hours */}
        <div className="p-4 bg-gray-50 rounded shadow">
          <p>How many hours of sleep do you get per night?</p>
          {["Less than 5", "5-6", "7-8", "More than 8"].map((hours) => (
            <label key={hours} className="block">
              <input
                type="radio"
                name="sleepHours"
                value={hours}
                checked={data.sleepHours === hours}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, sleepHours: e.target.value }))
                }
                className="mr-2"
              />
              {hours}
            </label>
          ))}
        </div>

        {/* Exercise Frequency */}
        <div className="p-4 bg-gray-50 rounded shadow">
          <p>How often do you exercise?</p>
          {["Daily", "3-5 times/week", "1-2 times/week", "Rarely", "Never"].map((freq) => (
            <label key={freq} className="block">
              <input
                type="radio"
                name="exerciseFrequency"
                value={freq}
                checked={data.exerciseFrequency === freq}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, exerciseFrequency: e.target.value }))
                }
                className="mr-2"
              />
              {freq}
            </label>
          ))}
        </div>
      </div>
    );
  }
);

export default Section3LifestyleHealthFactors;
