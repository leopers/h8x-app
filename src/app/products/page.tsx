"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import { getProducts } from "./actions";
import { useEffect, useState } from "react";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <h1 className="flex-1 text-center text-lg font-semibold text-[#27005D]">
          Produtos
        </h1>
        <Link href="/my-products" className="text-[#7A6FF0] font-semibold text-sm">
          Meus Produtos
        </Link>
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
            placeholder="Pesquisar produtos..." 
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
              {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto disponível"}
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
            <Link key={product.id} href={`/product-info?id=${product.id}`}>
              <Card className="relative p-4 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
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
                    
                    {/* Seller Info */}
                    <div className="flex gap-1 mb-2">
                      <span className="bg-blue-100 text-blue-600 rounded-md px-2 py-1 text-xs font-medium">
                        {product.seller.name}
                      </span>
                    </div>
                    
                    {/* Price and Code */}
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      <span className="font-medium">
                        {formatPrice(product.price) || "Preço a combinar"}
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
                      <span className="text-[#7A6FF0] text-sm">
                        Ver detalhes
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Button - Por enquanto todos como "À Venda" */}
                <div className="w-full mt-4 rounded-full py-3 text-sm font-semibold bg-[#27005D] text-white text-center">
                  À Venda
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
