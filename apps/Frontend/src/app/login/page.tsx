"use client";

import { useState } from "react";
import BrandPanel from "./_components/BrandPanel";
import SignInForm from "./_components/SignInForm";
import SignUpForm from "./_components/SignUpForm";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-screen">
      <BrandPanel />
      {isSignup ? (
        <SignUpForm showSocial={true} onSwitch={() => setIsSignup(false)} />
      ) : (
        <SignInForm showSocial={true} onSwitch={() => setIsSignup(true)} />
      )}
    </div>
  );
}
