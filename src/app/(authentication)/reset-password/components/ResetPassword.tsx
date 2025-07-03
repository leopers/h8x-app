"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { resetPassword } from "@/lib/auth-client";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const token = searchParams?.get("token") as string;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
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

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPassword(
        {
          newPassword: data.password,
          token: token,
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
            setSuccess("Senha alterada com sucesso");
            toast.success("Sua nova senha foi criada com sucesso");
            setTimeout(() => {
              router.replace("/login");
            }, 2000);
          },
          onError: (ctx) => {
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
    <div className="flex justify-center items-center min-h-[500px] p-4 bg-[hsl(var(--primary-bg))]">
      <Card className="w-full max-w-md shadow-lg border border-[hsl(var(--positive-stroke))]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-[hsl(var(--text-primary))] text-2xl font-medium text-center">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-[hsl(var(--text-secondary))] text-center">
            Crie uma nova senha para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(var(--text-primary))] font-medium">
                Nova Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="************"
                  {...register("password")}
                  disabled={loading}
                  className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
              </div>
              {errors.password && (
                <p className="text-[hsl(var(--error-color))] text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[hsl(var(--text-primary))] font-medium">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="************"
                  {...register("confirmPassword")}
                  disabled={loading}
                  className="pl-10 bg-white border-[hsl(var(--positive-stroke-solid))] focus:border-[hsl(var(--btn-primary))] focus:ring-[hsl(var(--btn-primary))] transition-all duration-200"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[hsl(var(--text-secondary))]" />
              </div>
              {errors.confirmPassword && (
                <p className="text-[hsl(var(--error-color))] text-sm mt-1">{errors.confirmPassword.message}</p>
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
                  Processando...
                </span>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-[hsl(var(--text-secondary))] text-sm">
            Lembrou sua senha?{" "}
            <Link
              href="/login"
              className="text-[hsl(var(--btn-primary))] hover:text-[hsl(var(--btn-primary-hover))] transition-colors duration-200"
            >
              Fazer login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
