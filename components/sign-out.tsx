"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";
import { LogOut, Power } from "lucide-react";

export function SignOut() {
  const { signOut } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingButton
      onClick={() => {
        setIsLoading(true);
        void signOut();
      }}
      isLoading={isLoading}
      className="w-full bg-black hover:bg-gray-900 text-white border-4 border-black brutalist-shadow hover:brutalist-shadow-hover font-black uppercase tracking-wide text-sm h-12"
    >
      <Power className="mr-2 h-4 w-4" />
      SIGN OUT
      <LogOut className="ml-2 h-4 w-4" />
    </LoadingButton>
  );
}
