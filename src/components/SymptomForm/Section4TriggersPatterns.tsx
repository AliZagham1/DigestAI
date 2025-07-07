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

const Section4TriggersPatterns = forwardRef<SectionRefHandle, Props>(
  ({ data, setData }, ref) => {
    const [error, setError] = useState("");

    const toggle = (list: string[], value: string) =>
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

    const validate = () => {
      if (
        data.foodTrigger === "" ||
        data.symptomPatterns.length === 0 ||
        (data.symptomPatterns.includes("Other") && data.otherPattern.trim() === "") ||
        data.bowelFrequency === "" ||
        data.bowelConsistency === "" ||
        data.bowelColor === ""
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
        <h2 className="text-xl font-semibold">Section 4: Symptom Triggers & Patterns</h2>
        {error && <p className="text-red-600">{error}</p>}

        {/* Food Trigger */}
        <div className="p-4 bg-gray-50 rounded shadow">
          <p>Have you noticed any specific foods that trigger your symptoms?</p>
          {["Yes", "No", "Unsure"].map((option) => (
            <label key={option} className="block">
              <input
                type="radio"
                name="foodTrigger"
                value={option}
                checked={data.foodTrigger === option}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, foodTrigger: e.target.value }))
                }
                className="mr-2"
              />
              {option}
            </label>
          ))}

          {data.foodTrigger === "Yes" && (
            <input
              type="text"
              placeholder="Please specify"
              value={data.triggerFoodDetails}
              onChange={(e) =>
                setData((prev) => ({ ...prev, triggerFoodDetails: e.target.value }))
              }
              className="mt-2 p-2 border rounded w-full"
            />
          )}
        </div>

        {/* Symptom Patterns */}
        <div className="p-4 bg-gray-50 rounded shadow">
          <p>Do your symptoms follow any noticeable pattern?</p>
          {[
            "Worse in the morning",
            "Worse in the evening",
            "Worse after meals",
            "Worse during stress",
            "No clear pattern",
            "Other",
          ].map((pattern) => (
            <label key={pattern} className="block">
              <input
                type="checkbox"
                value={pattern}
                checked={data.symptomPatterns.includes(pattern)}
                onChange={() =>
                  setData((prev) => ({
                    ...prev,
                    symptomPatterns: toggle(prev.symptomPatterns, pattern),
                  }))
                }
                className="mr-2"
              />
              {pattern}
            </label>
          ))}
          {data.symptomPatterns.includes("Other") && (
            <input
              type="text"
              placeholder="Please specify"
              value={data.otherPattern}
              onChange={(e) =>
                setData((prev) => ({ ...prev, otherPattern: e.target.value }))
              }
              className="mt-2 p-2 border rounded w-full"
            />
          )}
        </div>

        {/* Bowel Movement Tracking */}
        <div className="p-4 bg-gray-50 rounded shadow">
          <p>Let’s talk about your bowel movements:</p>

          <label className="block mt-2">
            Frequency (per day/week)
            <input
              type="text"
              value={data.bowelFrequency}
              onChange={(e) =>
                setData((prev) => ({ ...prev, bowelFrequency: e.target.value }))
              }
              className="mt-1 p-2 border rounded w-full"
              placeholder="e.g., 1-2 times per day"
            />
          </label>

          <label className="block mt-2">
            Consistency 
            <input
         
              type="text"
              value={data.bowelConsistency}
              onChange={(e) =>
                setData((prev) => ({ ...prev, bowelConsistency: e.target.value }))
              }
              className="mt-1 p-2 border rounded w-full"
              placeholder="e.g., soft and formed, loose, hard pellets"
            />
          </label>

          <label className="block mt-2">
            Color (normal, pale, dark, etc.)
            <input
              type="text"
              value={data.bowelColor}
              onChange={(e) =>
                setData((prev) => ({ ...prev, bowelColor: e.target.value }))
              }
              className="mt-1 p-2 border rounded w-full"
              placeholder="e.g., normal"
            />
          </label>
        </div>
      </div>
    );
  }
);

export default Section4TriggersPatterns;
