"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MoreVertical, Plus } from "lucide-react";
import { getUserProducts } from "./actions";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  s3UrlImage: string | null;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  seller: {
    id: string;
    name: string;
    email: string;
  };
};

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const fetchUserProducts = async () => {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          const userProducts = await getUserProducts(session.user.id);
          setProducts(userProducts);
        } catch (error) {
          console.error("Erro ao carregar produtos:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (!isPending) {
      fetchUserProducts();
    }
  }, [session?.user?.id, isPending]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para formatar preço
  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100); // Assumindo que o preço está em centavos
  };

  // Função para gerar um código fictício baseado no ID
  const generateCode = (id: string) => {
    const prefix = ["HBC", "HBA", "HBB"][Math.floor(Math.random() * 3)];
    const suffix = id.slice(-3).toUpperCase();
    return `${prefix} ${suffix}`;
  };

  // Mostrar loading se sessão ainda está carregando
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A6FF0] mx-auto mb-4"></div>
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  // Mostrar login se não estiver autenticado
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <h2 className="text-lg font-semibold text-[#27005D] mb-4">
            Acesso Necessário
          </h2>
          <p className="text-gray-500 mb-4">
            Você precisa estar logado para ver seus produtos.
          </p>
          <Link href="/login">
            <Button className="w-full bg-[#7A6FF0] text-white">
              Fazer Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <Link href="/products" className="text-[#7A6FF0] font-semibold text-sm">
          Voltar
        </Link>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#27005D] -ml-8">
          Seus Produtos
        </h1>
        <div className="w-12" />
      </div>

      {/* Search Bar and Add Button */}
      <div className="flex items-center gap-2 px-4 mb-4">
        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-3 border border-gray-200 shadow-sm">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input 
            type="text" 
            placeholder="Pesquisar e Editar..." 
            className="bg-transparent outline-none flex-1 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/products/new">
          <Button className="rounded-full bg-[#7A6FF0] p-3 min-w-0 h-12 w-12 flex items-center justify-center shadow-md">
            <Plus className="w-6 h-6 text-white" />
          </Button>
        </Link>
      </div>

      {/* Products List */}
      <div className="flex flex-col gap-4 px-4 pb-20">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7A6FF0] mx-auto mb-4"></div>
            <div className="text-gray-500">Carregando produtos...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm ? "Nenhum produto encontrado" : "Você ainda não tem produtos"}
            </div>
            {!searchTerm && (
              <Link href="/products/new">
                <Button className="bg-[#7A6FF0] text-white">
                  Criar Primeiro Produto
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="relative p-4 rounded-2xl shadow-sm bg-white">
              {/* Options Menu */}
              <button className="absolute top-4 right-4 p-1">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="flex gap-3 items-start">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.s3UrlImage ? (
                    <Image
                      src={product.s3UrlImage}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center p-2">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="flex-1 pr-6">
                  <div className="font-semibold text-base text-[#27005D] mb-1">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {product.description || "Sem descrição"}
                  </div>
                  
                  {/* Categories - Usando dados fictícios por enquanto */}
                  <div className="flex gap-1 mb-2">
                    <span className="bg-gray-100 text-gray-600 rounded-md px-2 py-1 text-xs font-medium">
                      PRODUTO
                    </span>
                  </div>
                  
                  {/* Price and Code */}
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <span className="font-medium">
                      {formatPrice(product.price) || "Sem preço"}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{generateCode(product.id)}</span>
                  </div>
                  
                  {/* Rating and Comments - Dados fictícios por enquanto */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#F7B801] text-[#F7B801]" />
                      <span className="font-medium text-[#F7B801]">
                        4.5
                      </span>
                    </div>
                    <span className="text-gray-400">(0)</span>
                    <Link href="#" className="text-[#7A6FF0] underline text-sm">
                      Ver comentários
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Status Button - Por enquanto todos como "À Venda" */}
              <Button
                className="w-full mt-4 rounded-full py-3 text-sm font-semibold bg-[#27005D] text-white"
              >
                À Venda
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
