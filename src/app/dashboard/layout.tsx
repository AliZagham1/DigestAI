import React from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
     
      <nav className="w-64 bg-white shadow-lg p-6 flex flex-col gap-4">
        <Link href="/dashboard" className="text-lg font-semibold hover:text-blue-600">
          Dashboard
        </Link>
        <Link href="/dashboard/symptoms" className="text-lg font-semibold hover:text-blue-600">
          Symptoms
        </Link>
        <Link href="/dashboard/ai-insights" className="text-lg font-semibold hover:text-blue-600">
          AI Overall Summary 
        </Link>
      
      </nav>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
