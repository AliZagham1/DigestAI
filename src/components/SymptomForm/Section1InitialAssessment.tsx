"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";

import {FormDataType} from "@/types/form"

type Props = {
  data: FormDataType;
  setData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

type SectionRefHandle = {
  validate: () => boolean;
};

const Section1InitialAssessment = forwardRef<SectionRefHandle, Props>(
  ({ data, setData }, ref) => {

   const [error, setError] = useState("");

  const toggle = (list: string[], value: string) =>
    list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];

  const validate = () => {
    if (
      data.selectedSymptoms.length === 0 ||
      (data.selectedSymptoms.includes("Other") && data.otherSymptom.trim() === "") ||
      data.diagnoses.length === 0 ||
      (data.diagnoses.includes("Other") && data.otherDiagnosis.trim() === "") ||
      data.duration === "" 
      
      
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
      <h2 className="text-xl font-semibold">Section 1: Initial Assessment</h2>
      {error && <p className="text-red-600">{error}</p>}

      {/* Symptoms */}
      <div className="p-4 bg-gray-50 rounded shadow">
        <p>What specific gut health concerns are you experiencing?</p>
        {["Bloating", "Gas", "Constipation", "Diarrhea", "Other"].map((symptom) => (
          <label key={symptom} className="block">
            <input
              type="checkbox"
              value={symptom}
              checked={data.selectedSymptoms.includes(symptom)}
              onChange={() =>
                setData((prevData) => ({
                  ...prevData,
                  selectedSymptoms: toggle(prevData.selectedSymptoms, symptom),
                }))
              }
              className="mr-2"
            />
            {symptom}
          </label>
        ))}

        
        {data.selectedSymptoms.includes("Other") && (
          <input
            type="text"
            value={data.otherSymptom}
            onChange={(e) =>
              setData((prevData) => ({
                ...prevData,
                otherSymptom: e.target.value,
              }))
            }
            placeholder="Please specify"
            className="mt-2 p-2 border rounded w-full"
          />
        )}
        {}
      </div>

      {/* Duration */}
      <div className="p-4 bg-gray-50 rounded shadow">
        <p>How long have you been experiencing these symptoms?</p>
        {["Less than 1 week", "1-4 weeks", "1-6 months", "More than 6 months"].map((d) => (
          <label key={d} className="block">
            <input
              type="radio"
              name="duration"
              value={d}
              checked={data.duration === d}
              onChange={(e) => 
                setData((prevData) => ({
                  ...prevData,
                  duration: e.target.value,
                }))
              }
              className="mr-2"
            />
            {d}
          </label>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded shadow">
        <p>Do you have any of the redFlags? (Please check all that apply)?</p>
        {["Blood in stool", "unintended weight loss", "Fever", "Abdominal pain", "Fatigue or weakness", "Fainting or dizziness" ].map((condition) => (
          <label key={condition} className="block">
            <input
              type="checkbox"
              value={condition}
              checked={data.redFlags.includes(condition)}
              onChange={() => {
                const updated = toggle(data.redFlags, condition);
                const cleaned = updated.filter((d) => d !== "None");
              
                setData((prevData) => ({
                  ...prevData,
                  redFlags: cleaned,
                }));
              }}
              
              className="mr-2"
            />
            {condition}
          </label>
        ))}
       

        <label>
          <input
          type ="checkbox"
          value = "None"
          checked = {data.redFlags.includes("None")}
          onChange = {() => {
            const ischecked = data.redFlags.includes("None");
           setData ((prevData) => ({
             ...prevData,
             redFlags : ischecked ? [] : ["None"],
           }))
          }}
          className = "mr-2"
          
          
          />

          None
        </label>
        </div>

      

      {/* Diagnoses */}
      <div className="p-4 bg-gray-50 rounded shadow">
        <p>Have you been diagnosed with any of the following?</p>
        {["IBS", "GERD", "Celiac", "Other"].map((condition) => (
          <label key={condition} className="block">
            <input
              type="checkbox"
              value={condition}
              checked={data.diagnoses.includes(condition)}
              onChange={() => {
                const updated = toggle(data.diagnoses, condition);
                const cleaned = updated.filter((d) => d !== "None");
              
                setData((prevData) => ({
                  ...prevData,
                  diagnoses: cleaned,
                }));
              }}
              
              className="mr-2"
            />
            {condition}
          </label>
        ))}
        {data.diagnoses.includes("Other") && (
          <input
            type="text"
            value={data.otherDiagnosis}
            onChange={(e) =>
              setData((prevData) => ({
                ...prevData,
                otherDiagnosis: e.target.value,
              }))
            
            }
            placeholder="Specify diagnosis"
            className="mt-2 p-2 border rounded w-full"
          />
        )}

        <label>
          <input
          type ="checkbox"
          value = "None"
          checked = {data.diagnoses.includes("None")}
          onChange = {() => {
            const ischecked = data.diagnoses.includes("None");
           setData ((prevData) => ({
             ...prevData,
             diagnoses : ischecked ? [] : ["None"],
             otherDiagnosis : ""
           }))
          }}
          className = "mr-2"
          
          
          />

          None
        </label>

        
      </div>

      
    </div>
  );
});

export default Section1InitialAssessment;
