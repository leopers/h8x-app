// src/components/auth/ForgotPassword.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { forgetPassword } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const resetState = () => {
    setMessage(null);
  };

  const setSuccess = (msg: string) => {
    setMessage(msg);
    setLoading(false);
  };

  const setError = (msg: string) => {
    setMessage(null);
    setLoading(false);

    toast.error(msg);
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgetPassword(
        {
          email: data.email,
          redirectTo: "/reset-password",
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            resetState();
            setLoading(true);
          },
          onSuccess: () => {
            setSuccess("Link de recuperação de senha enviado com sucesso");
          },
          onError: (ctx: any) => {
            setError(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.log(error);
      setError("Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4 bg-[hsl(var(--primary-bg))]">
      <Card className="w-full max-w-md shadow-lg border border-[hsl(var(--positive-stroke))]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[hsl(var(--text-primary))] text-2xl font-medium text-center">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-[hsl(var(--text-secondary))] text-center">
            Digite seu e-mail para receber um link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[hsl(var(--text-primary))] font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...register("email")}
                  disabled={loading}
                  className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
              </div>
              {errors.email && (
                <p className="text-[hsl(var(--error-color))] text-sm mt-1">
                  {errors.email.message === "Invalid type"
                    ? "Por favor, insira um e-mail válido"
                    : errors.email.message === "Email is required"
                      ? "E-mail é obrigatório"
                      : errors.email.message}
                </p>
              )}
            </div>

            {message && (
              <div className="bg-[hsl(var(--success-background))] p-3 rounded-md border border-[hsl(var(--success-color))]">
                <p className="text-[hsl(var(--success-color))] text-sm">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 gap-2 bg-[hsl(var(--btn-primary))] text-white hover:bg-[hsl(var(--btn-primary-hover))] transition-all duration-200 font-medium rounded-md shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </span>
              ) : (
                "Enviar Link de Recuperação"
              )}
            </Button>

            <div className="text-center">
              <a
                href="/login"
                className="text-[hsl(var(--btn-primary))] hover:text-[hsl(var(--btn-primary-hover))] text-sm transition-colors duration-200"
              >
                Voltar para o login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
