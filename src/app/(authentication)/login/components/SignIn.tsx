"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import { signIn, forgetPassword } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Card className="border-none shadow-none bg-white rounded-none">
      <CardHeader className="pb-1 text-center">
        <CardTitle className="text-xl font-medium text-[hsl(var(--text-primary))]">Entre agora mesmo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[hsl(var(--text-primary))] font-medium">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="shelby_baby@gmail.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-[hsl(var(--text-primary))] font-medium">
                Senha
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
            </div>

            <div>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm text-[#18005E] hover:text-[#18005E] transition-colors duration-200"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#18005E] text-white hover:bg-[#18005E] transition-all duration-200 font-medium rounded-md shadow-sm"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await signIn.email({
                  email,
                  password,
                  callbackURL: "/",
                  fetchOptions: {
                    onSuccess: () => {
                      // Redireciona automaticamente após login bem-sucedido
                    },
                    onError: async (ctx) => {
                      console.log(ctx);
                      if (ctx.error.status === 401) {
                        const userVerificationResponse = await fetch(`/api/auth/verify-user?email=${email}`);
                        const userVerification = await userVerificationResponse.json();
                        if (userVerificationResponse.status === 404) {
                          toast.error("Não foi possível encontrar o usuário");
                        }
                        if (userVerificationResponse.status === 200 && !userVerification.accountVerified) {
                          toast.custom(
                            () => (
                              <div className="w-full bg-white rounded-md shadow-lg border border-[hsl(var(--positive-stroke))] p-6">
                                <div className="text-center">
                                  <div className="mb-4 text-[hsl(var(--text-primary))]">
                                    Para sua segurança, um email foi enviado para {email} com as instruções para você
                                    redefinir sua senha. Redefina e faça login com a nova senha.
                                  </div>
                                </div>
                              </div>
                            ),
                            {
                              duration: 8000,
                            }
                          );

                          await forgetPassword({
                            email: email,
                            redirectTo: "/reset-password",
                          });
                        }
                      }
                      console.error("Erro de login:", ctx.error.message);
                    },
                  },
                });
              } catch (error) {
                console.error("Erro ao fazer login:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </span>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="relative flex items-center gap-3 py-2">
            <div className="flex-grow border-t border-[hsl(var(--positive-stroke-solid))]"></div>
            <span className="text-xs text-[hsl(var(--text-secondary))]">OU</span>
            <div className="flex-grow border-t border-[hsl(var(--positive-stroke-solid))]"></div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 gap-2 border-[hsl(var(--positive-stroke-solid))] hover:bg-[hsla(var(--btn-primary)/0.05)] transition-all duration-200"
            onClick={async () => {
              await signIn.social({
                provider: "google",
                callbackURL: "/",
              });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 262">
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            <span className="text-[hsl(var(--text-primary))]">Entrar com Google</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
