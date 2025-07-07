"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    <Button
      variant="outline"
      onClick={() => signOut({ redirectUrl: "/sign-in" })}
    >
      Sign Out
    </Button>
  );
};
