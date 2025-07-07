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

const Section5PreviousEfforts = forwardRef<SectionRefHandle, Props>(
  ({ data, setData }, ref) => {
    const [error, setError] = useState("");

    const toggle = (list: string[], value: string) =>
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

    const validate = () => {
      if (
        data.previousEfforts.length === 0 ||
        (data.previousEfforts.includes("Other") && data.otherEffort.trim() === "")
      ) {
        setError("Please select at least one method or specify your effort.");
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
        <h2 className="text-xl font-semibold">Section 5: Previous Efforts</h2>
        {error && <p className="text-red-600">{error}</p>}

        <div className="p-4 bg-gray-50 rounded shadow">
          <p>What methods have you already tried to improve your gut health?</p>
          {[
            "Dietary changes",
            "Stress management",
            "Sleep improvement",
            "Hydration",
            "Supplements",
            "Medical treatments",
            "Other",
          ].map((effort) => (
            <label key={effort} className="block">
              <input
                type="checkbox"
                value={effort}
                checked={data.previousEfforts.includes(effort)}
                onChange={() =>
                  setData((prev) => ({
                    ...prev,
                    previousEfforts: toggle(prev.previousEfforts, effort),
                  }))
                }
                className="mr-2"
              />
              {effort}
            </label>
          ))}

          {data.previousEfforts.includes("Other") && (
            <input
              type="text"
              value={data.otherEffort}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  otherEffort: e.target.value,
                }))
              }
              placeholder="Please specify"
              className="mt-2 p-2 border rounded w-full"
            />
          )}
        </div>
      </div>
    );
  }
);

export default Section5PreviousEfforts;
