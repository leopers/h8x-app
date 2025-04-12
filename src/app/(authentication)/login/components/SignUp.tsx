"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Card className="border-none shadow-none bg-white rounded-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium text-[hsl(var(--text-primary))]">Cadastrar</CardTitle>
        <CardDescription className="text-[hsl(var(--text-secondary))]">
          Digite suas informações para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name" className="text-[hsl(var(--text-primary))] font-medium">
                Nome de Usuário
              </Label>
              <div className="relative">
                <Input
                  id="first-name"
                  placeholder="João"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[hsl(var(--text-primary))] font-medium">
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
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
          {email.length > 0 && !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) && (
            <p className="text-red-500 text-sm">Email inválido</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[hsl(var(--text-primary))] font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Senha"
                className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
            </div>
          </div>

          <div className="space-y-2">
            {password.length < 8 && password.length > 0 && (
              <p className="text-red-500 text-sm">A senha deve ter pelo menos 8 caracteres</p>
            )}
            {password.length > 0 && !/[A-Z]/.test(password) && (
              <p className="text-red-500 text-sm">A senha deve ter pelo menos uma letra maiúscula</p>
            )}
            {password.length > 0 && !/[!@#$%^&*]/.test(password) && (
              <p className="text-red-500 text-sm">A senha deve ter pelo menos um caracter especial</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-[hsl(var(--text-primary))] font-medium">
              Confirmar Senha
            </Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirmar Senha"
                className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
            </div>
          </div>
          {password !== passwordConfirmation && <p className="text-red-500 text-sm">As senhas não coincidem</p>}

          <Button
            type="submit"
            className="w-full h-11 bg-[#18005E] text-white hover:bg-[#18005E] transition-all duration-200 font-medium rounded-md shadow-sm"
            disabled={loading}
            onClick={async () => {
              await signUp.email({
                email,
                password,
                name: `${firstName}`,
                callbackURL: "/",
                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },
                  onRequest: () => {
                    setLoading(true);
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                  onSuccess: async () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </span>
            ) : (
              "Criar conta"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
