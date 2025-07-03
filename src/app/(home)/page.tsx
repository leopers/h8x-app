"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MapPin, LogOut, ChevronRight } from "lucide-react";
import { getUserHomeData } from "./actions";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  s3UrlImage: string | null;
  createdAt: Date;
}

interface HomeData {
  user: UserData;
  products: ProductData[];
}

export default function Home() {
  const router = useRouter();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      const data = await getUserHomeData();
      setHomeData(data);
    } catch (error) {
      console.error("Error loading home data:", error);
      setError("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
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
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Grátis";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27005D] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Erro ao carregar dados"}</p>
          <Button onClick={loadHomeData} className="mt-2">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const { user, products } = homeData;

  return (
    <div className="mb-10">
      <div className="relative">
        <div className="bg-white px-4 pb-6">
          <div className="flex flex-col items-center ">
            <Avatar className="w-[100px] h-[100px] border-4 border-white rounded-full">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-[#27005D] text-white text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-3 text-lg font-semibold">{user.name}</h1>
            <p className="text-sm text-gray-600">{user.email}</p>

            <div className="flex items-center gap-1 mt-1 text-gray-600">
              <MapPin size={14} />
              <span className="text-sm">São José dos Campos</span>
            </div>

            <div className="flex justify-center mt-4">
              <div className="text-center">
                <div className="font-semibold text-lg">{products.length}</div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 w-full max-w-[280px]">
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="flex-1 h-9 bg-[#27005D] text-white border-none hover:bg-[#27005D]/90 text-sm"
                >
                  Editar Perfil
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="flex-1 h-9 bg-red-600 text-white border-none hover:bg-red-700 text-sm flex items-center gap-1"
              >
                <LogOut size={14} />
                {isLoggingOut ? "Saindo..." : "Sair"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Seus produtos</h2>
          <Link
            href="/my-products"
            className="text-sm text-[#27005D] hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {products.map((product) => (
              <Link key={product.id} href={`/product-info?id=${product.id}`}>
                <Card className="overflow-hidden border-0 shadow-sm">
                  <div className="aspect-square relative">
                    {product.s3UrlImage ? (
                      <Image
                        src={product.s3UrlImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs text-center p-2">
                          {product.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-medium truncate">
                      {product.name}
                    </h3>
                    {product.price !== null && (
                      <p className="text-xs text-[#27005D] font-semibold">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Você ainda não tem produtos</p>
            <Link href="/products/new">
              <Button className="mt-2 bg-[#27005D] hover:bg-[#27005D]/90 text-white">
                Adicionar produto
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="px-4 mt-4">
        <Link href="/products" className="block">
          <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-xl font-bold text-[#27005D]">H8</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Explorar</span>
                <span className="text-sm text-[#27005D] font-semibold">
                  Ver todos os produtos
                </span>
              </div>
            </div>
            <div className="w-8 h-8 bg-[#27005D] rounded-lg flex items-center justify-center">
              <ChevronRight size={16} className="text-white" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
