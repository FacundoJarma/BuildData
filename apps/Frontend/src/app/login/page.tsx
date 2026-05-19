"use client";

import { useState } from "react";
import BrandPanel from "./sections/BrandPanel";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";

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
