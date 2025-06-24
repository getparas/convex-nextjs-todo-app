"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Lock, ArrowRight } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black border-4 border-black brutalist-shadow-lg mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-black mb-4 tracking-tight">
            SIGN IN
          </h1>
          <p className="text-xl font-medium text-muted uppercase tracking-wide">
            ACCESS YOUR WORKSPACE
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="card-brutalist">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-black text-black uppercase tracking-wide">
              AUTHENTICATE
            </CardTitle>
            <CardDescription className="text-base font-medium text-muted uppercase">
              CONTINUE WITH GITHUB
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <LoadingButton
              onClick={() => {
                setIsLoading(true);
                void signIn("github", {
                  redirectTo: "/",
                });
              }}
              className="btn-brutalist w-full h-16 text-lg"
              isLoading={isLoading}
            >
              <Github className="mr-3 h-6 w-6" />
              GITHUB LOGIN
              <ArrowRight className="ml-3 h-6 w-6" />
            </LoadingButton>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-muted uppercase tracking-wide">
            SECURE • FAST • RELIABLE
          </p>
        </div>
      </div>
    </div>
  );
}
