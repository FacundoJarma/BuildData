"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BrandPanel from "./_components/BrandPanel";
import SignInForm from "./_components/SignInForm";
import SignUpForm from "./_components/SignUpForm";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/projects");
    }
  }, [loading, isAuthenticated, router]);

  const handleSwitchToSignIn = (msg?: string) => {
    setSuccessMessage(msg ?? null);
    setIsSignup(false);
  };

  if (loading) return null;
  if (isAuthenticated) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-screen">
      <BrandPanel />
      {isSignup ? (
        <SignUpForm
          showSocial={true}
          onSwitch={() => handleSwitchToSignIn()}
          onSuccess={(msg) => handleSwitchToSignIn(msg)}
        />
      ) : (
        <SignInForm
          showSocial={true}
          onSwitch={() => setIsSignup(true)}
          successMessage={successMessage}
        />
      )}
    </div>
  );
}
