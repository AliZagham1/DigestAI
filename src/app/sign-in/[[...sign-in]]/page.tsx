"use client";
import {useEffect} from "react";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <SignIn />
    </div>
  );
}
