"use client";

import { useState } from "react";
import LoginBrandPanel from "../sections/LoginBrandPanel";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] min-h-screen">
      <LoginBrandPanel />
      {isSignup ? (
        <SignUpForm showSocial={true} onSwitch={() => setIsSignup(false)} />
      ) : (
        <SignInForm showSocial={true} onSwitch={() => setIsSignup(true)} />
      )}
    </div>
  );
}
