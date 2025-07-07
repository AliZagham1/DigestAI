'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, ClipboardCheck } from "lucide-react";


export default function HomePage() {
  const router = useRouter();

  

 

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 rounded-xl shadow-md text-center space-y-8">

      {/* Hero Section with Icon */}
      <div className="space-y-2">
        <Sparkles className="mx-auto w-12 h-12 text-indigo-600" />
        <h1 className="text-4xl font-bold">Welcome to DigestAI</h1>
        <p className="text-gray-600">Your Personal Gut Health Assistant</p>
        <p>Answer a few questions and get quick, AI-powered insights about your digestive health.</p>
        <Button onClick={() => router.push("/sign-up")}>
  Start Now
</Button>
      </div>

      {/* How It Works Section with Light Background */}
      <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
        <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-green-600" /> 
            Answer questions about your symptoms
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" /> 
            Get AI-powered insights and suggestions
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" /> 
            Pattern Recognition and Recommendations
          </li>
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 mt-4">
        DigestAI provides general wellness information and is not a replacement for medical advice. Always consult a healthcare professional.
      </p>
    </div>
  );
}
