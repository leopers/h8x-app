"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile, updateUserProfile } from "./actions";
import { ArrowLeft, User, Mail, Calendar, Check, X, Edit, LogOut, MessageCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await getUserProfile();
      if (profile) {
        setUser(profile);
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          image: profile.image || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Erro ao carregar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const result = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        image: formData.image || undefined,
      });

              if (result.success && result.user) {
          setUser(result.user);
          setSuccess("Perfil atualizado com sucesso!");
          setIsEditing(false);
        } else {
        setError(result.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Erro ao salvar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Erro ao fazer logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27005D] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar perfil</p>
          <Button onClick={loadUserProfile} className="mt-2">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Perfil</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Avatar Section */}
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.image || formData.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-[#27005D] text-white text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="mt-4 w-full">
                <Label htmlFor="image" className="text-sm font-medium">
                  URL da Imagem
                </Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Informações Pessoais</h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Editar
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User size={16} />
                Nome
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1"
                  placeholder="Digite seu nome"
                />
              ) : (
                <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded-md">
                  {user.name || "Nome não informado"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail size={16} />
                Email
                {user.emailVerified && (
                  <Check size={14} className="text-green-600" />
                )}
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                  placeholder="Digite seu email"
                />
              ) : (
                <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded-md">
                  {user.email || "Email não informado"}
                </p>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-[#27005D] hover:bg-[#27005D]/90"
              >
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/profile/conversations">
              <Button 
                variant="outline" 
                className="w-full h-16 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <MessageCircle size={20} className="text-blue-600" />
                <span className="text-sm">Conversas</span>
              </Button>
            </Link>
            <Link href="/my-products">
              <Button 
                variant="outline" 
                className="w-full h-16 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-200"
              >
                <ShoppingBag size={20} className="text-green-600" />
                <span className="text-sm">Meus Produtos</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informações da Conta</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar size={16} />
                Conta criada em
              </span>
              <span className="text-sm font-medium">
                {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Última atualização</span>
              <span className="text-sm font-medium">
                {formatDate(user.updatedAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status do email</span>
              <span className={`text-sm font-medium flex items-center gap-1 ${
                user.emailVerified ? "text-green-600" : "text-orange-600"
              }`}>
                {user.emailVerified ? (
                  <>
                    <Check size={14} />
                    Verificado
                  </>
                ) : (
                  <>
                    <X size={14} />
                    Não verificado
                  </>
                )}
              </span>
            </div>
          </div>
        </Card>

        {/* Logout Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sair da Conta</h2>
          <p className="text-sm text-gray-600 mb-4">
            Desconectar-se desta conta e retornar à tela de login.
          </p>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
            className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut size={16} />
            {isLoggingOut ? "Saindo..." : "Sair da Conta"}
          </Button>
        </Card>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}
