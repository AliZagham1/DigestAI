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

const Section2DietLifestyle = forwardRef<SectionRefHandle, Props>(({ data, setData }, ref) => {
  const [error, setError] = useState("");

  const validate = () => {
    if (
      data.dietType === "" ||
      data.fruitVegIntake === "" ||
      data.waterIntake === ""
    ) {
      setError("Please fill all required fields before continuing.");
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
      <h2 className="text-xl font-semibold">Section 2: Diet & Lifestyle</h2>
      {error && <p className="text-red-600">{error}</p>}

      {/* Diet Type */}
      <div className="p-4 bg-gray-50 rounded shadow">
        <p>How would you describe your typical diet?</p>
        {["Omnivore", "Vegetarian", "Vegan", "Ketogenic", "Other"].map((type) => (
          <label key={type} className="block">
            <input
              type="radio"
              name="diet"
              value={type}
              checked={data.dietType === type}
              onChange={(e) =>
                setData((prev) => ({ ...prev, dietType: e.target.value }))
              }
              className="mr-2"
            />
            {type}
          </label>
        ))}
        {data.dietType === "Other" && (
          <input
            type="text"
            value={data.otherDiet}
            onChange={(e) =>
              setData((prev) => ({ ...prev, otherDiet: e.target.value }))
            }
            placeholder="Please specify"
            className="mt-2 p-2 border rounded w-full"
          />
        )}
      </div>

      {/* Fruit & Veg Intake */}
      <div className="p-4 bg-gray-50 rounded shadow">
        <p>How many servings of fruits and vegetables do you eat daily?</p>
        {["0-1", "2-3", "4-5", "More than 5"].map((value) => (
          <label key={value} className="block">
            <input
              type="radio"
              name="fruitVegIntake"
              value={value}
              checked={data.fruitVegIntake === value}
              onChange={(e) =>
                setData((prev) => ({ ...prev, fruitVegIntake: e.target.value }))
              }
              className="mr-2"
            />
            {value}
          </label>
        ))}
      </div>

      {/* Water Intake */}
      <div className="p-4 bg-gray-50 rounded shadow">
        <p>How many glasses of water do you typically drink per day?</p>
        {["Less than 2", "3-5", "6-8", "More than 8"].map((value) => (
          <label key={value} className="block">
            <input
              type="radio"
              name="waterIntake"
              value={value}
              checked={data.waterIntake === value}
              onChange={(e) =>
                setData((prev) => ({ ...prev, waterIntake: e.target.value }))
              }
              className="mr-2"
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
});

export default Section2DietLifestyle;
