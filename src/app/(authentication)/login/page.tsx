"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import SignIn from "./components/SignIn";
import { SignUp } from "./components/SignUp";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0F003A] to-[#18005E]">
      <div className="w-full max-w-md px-4 mt-10">
        <div className="flex items-center justify-center mb-6 text-center">
          <div className="flex items-center justify-center mr-2">
            <div className="bg-white p-2 rounded-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H21V21H3V3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M16.5 8.25H7.5V15.75H16.5V8.25Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 8.25L12 12L16.5 8.25"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-medium text-white">
            Seja bem vindo ao <span className="text-gray-400">H8X</span>
          </h1>
        </div>

        <div className="rounded-lg shadow-lg border border-[#18005E] bg-white overflow-hidden">
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-xl h-14 p-1 bg-gradient-to-r from-[#0F003A]/20 via-[#18005E]/20 to-[#0F003A]/20 backdrop-blur-sm border-[#18005E]/40">
              <TabsTrigger
                value="signin"
                className={cn(
                  "transition-all duration-300 rounded-lg text-white relative overflow-hidden group",
                  "hover:bg-[#18005E] hover:shadow-sm hover:text-white",
                  "data-[state=active]:bg-[#18005E] data-[state=active]:text-white data-[state=active]:shadow-md"
                )}
              >
                <span className="relative z-10">Entrar</span>
                <span className="absolute inset-0 bg-gradient-to-tr from-[#18005E]/80 to-[#18005E]/60 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={cn(
                  "transition-all duration-300 rounded-lg text-[#18005E] relative overflow-hidden group",
                  "hover:bg-[#0F003A] hover:shadow-sm hover:text-white",
                  "data-[state=active]:bg-[#0F003A] data-[state=active]:text-white data-[state=active]:shadow-md"
                )}
              >
                <span className="relative z-10">Cadastrar</span>
                <span className="absolute inset-0 bg-gradient-to-tr from-[#18005E]/80 to-[#18005E]/60 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </TabsTrigger>
            </TabsList>
            <div className="relative">
              <div
                className={cn(
                  "transition-all duration-300 transform",
                  activeTab === "signin"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[-100%] opacity-0 absolute inset-0"
                )}
              >
                <TabsContent value="signin" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <SignIn />
                </TabsContent>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 transform",
                  activeTab === "signup" ? "translate-x-0 opacity-100" : "translate-x-[100%] opacity-0 absolute inset-0"
                )}
              >
                <TabsContent value="signup" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <SignUp />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>

        <div className="mt-8 text-center text-[hsl(var(--text-secondary))] text-sm animate-fade-in">
          <p>© {new Date().getFullYear()} H8X. Todos os direitos reservados.</p>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#18005E]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0F003A]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}
