"use client";

import { useEffect } from "react";
import ForgotPassword from "./components/ForgotPassword";
import { useSidebarStore } from "@/stores/sidebarStore";

export default function ForgotPasswordPage() {
  const setVisibility = useSidebarStore((state) => state.setVisibility);

  useEffect(() => {
    setVisibility(false);
    return () => {
      setVisibility(true);
    };
  }, [setVisibility]);

  return (
    <div className="flex min-h-screen items-center bg-[#EFF0EB] justify-center p-4">
      <ForgotPassword />
    </div>
  );
}
