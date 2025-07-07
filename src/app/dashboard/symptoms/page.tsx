"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

import SymptomsCard from "@/components/SymptomsCard";

import { SymptomReport } from "@/types/form";

export default function SymptomsPage() {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isSignedIn, isLoaded } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function fetchReports() {
      setLoading(true);

      const { data, error } = await supabase
        .from("symptom_reports")
        .select("id, submitted_at, form_data")
        .eq("user_id_text", userId)
        .order("submitted_at", { ascending: true });

      if (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } else {
        setReports(data as SymptomReport[]);
      }
      setLoading(false);
    }

    fetchReports();
  }, [isLoaded, isSignedIn, user, userId]);

  if (!isLoaded || !isSignedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <SymptomsCard reports={reports} />
      </div>
    </div>
  );
}

