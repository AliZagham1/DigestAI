"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {SignOutButton} from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";


export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="w-full border-b p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold">
        DigestAI
      </Link>

      {isSignedIn && (
        <div className="flex gap-2">
            <Link href ="/">
                <Button variant ="ghost">Home</Button>
            </Link>
          <Link href="/input/page1">
            <Button variant="ghost">Form</Button>
          </Link>
          <Link href="/history">
            <Button variant="ghost">History</Button>
          </Link>
          <Link href ="/dashboard">
            <Button variant="ghost">Dashboard</Button></Link>

          <SignOutButton />

        </div>
      )}
    </nav>
  );
}
