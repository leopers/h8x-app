"use client";

import { Suspense, useEffect } from "react";
import ResetPasswordForm from "./components/ResetPassword";
import { useSidebarStore } from "@/stores/sidebarStore";

export default function ResetPasswordPage() {
  const setVisibility = useSidebarStore((state) => state.setVisibility);

  useEffect(() => {
    setVisibility(false);
    return () => {
      setVisibility(true);
    };
  }, [setVisibility]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
