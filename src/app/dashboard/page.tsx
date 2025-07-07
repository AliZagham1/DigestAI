"use client"; // Needed for client-side data fetching

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { CalendarIcon, BrainIcon, CheckCircleIcon, ArrowUpRightIcon} from "lucide-react";

import RiskLevelDistributionCard from "@/components/Chart";

import LifestyleFactorsCard from "@/components/LifestyleFactorsCard";


import {  SymptomReport } from "@/types/form";





export default function DashboardOverview() {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [loading, setLoading] = useState(true);

    const { user, isSignedIn, isLoaded } = useUser();
    const userId = user?.id;
   

  
  useEffect(() => {
    if (!isSignedIn || !isLoaded || !user) return;
    async function fetchReports() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("symptom_reports")
        .select("id, submitted_at, risk_level, confidence_score, form_data")
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
  }, [isLoaded, isSignedIn, user]); 
  if (!isLoaded || !isSignedIn || loading) {
    return <div>Loading...</div>;
  }

  
  const totalAssessments = reports.length;
  const averageConfidence = totalAssessments
    ? (reports.reduce((sum, r) => sum + (r.confidence_score ?? 0), 0) / totalAssessments).toFixed(1)
    : "N/A";
  const latestRisk = reports.at(-1)?.risk_level ?? "N/A";
  const riskColor =
    latestRisk === "high"
      ? "bg-red-100 text-red-600"
      : latestRisk === "moderate"
      ? "bg-yellow-100 text-yellow-600"
      : latestRisk === "low"
      ? "bg-green-100 text-green-600"
      : "bg-gray-100 text-gray-500";

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <Card
              icon={<CalendarIcon className="w-8 h-8" />}
              iconBg="bg-blue-100 text-blue-600"
              stat={totalAssessments}
              label="Total Assessments"
              sublabel="Since joining"
            />
    
            
            <Card
              icon={<BrainIcon className="w-8 h-8" />}
              iconBg="bg-purple-100 text-purple-600"
              stat={averageConfidence !== null ? `${averageConfidence}%` : "N/A"}
              label="Avg Confidence"
              sublabel="AI accuracy score"
              trend={<ArrowUpRightIcon className="w-5 h-5 text-green-500 absolute top-5 right-5" />}
            />
    
            
            <Card
              icon={<CheckCircleIcon className="w-8 h-8" />}
              iconBg={riskColor}
              stat={latestRisk.charAt(0).toUpperCase() + latestRisk.slice(1)}
              label="Current Risk"
              sublabel="Based on recent data"
              trend={<ArrowUpRightIcon className="w-5 h-5 text-green-500 absolute top-5 right-5" />}
            />
          </div>
          <div>
          <RiskLevelDistributionCard reports={reports} />
          </div>
          
          <div>
          <LifestyleFactorsCard reports={reports} />

          </div>
          
        </div>
      );
    }
    
    
    function Card({
      icon,
      iconBg,
      stat,
      label,
      sublabel,
      trend,
    }: {
      icon: React.ReactNode;
      iconBg: string;
      stat: string | number;
      label: string;
      sublabel?: string;
      trend?: React.ReactNode;
    }) {
      return (
        <div className="relative bg-white rounded-3xl shadow-lg px-8 py-7 flex items-center gap-5 min-h-[140px]">
          
          <div className={`flex items-center justify-center rounded-2xl ${iconBg} w-14 h-14`}>
            {icon}
          </div>
        
          <div>
            <div className="text-3xl font-bold text-gray-900">{stat}</div>
            <div className="text-lg font-medium text-gray-600">{label}</div>
            {sublabel && <div className="text-sm text-gray-400">{sublabel}</div>}
          </div>
          {trend}
        </div>
      );
    }