"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin, SlidersHorizontal } from "lucide-react";
import { getProducts } from "./actions";
import { useEffect, useState } from "react";
import { product } from "@/schemas/zod";
import { z } from "zod";
import { useProductsStore } from "./store";
import { useSession } from "@/lib/auth-client";

export default function Products() {
  const { products, fetchProducts, isLoading } = useProductsStore();
  const session = useSession();
  const userId = "123";
  useEffect(() => {
    fetchProducts(userId);
  }, []);
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <Link href="/" className="text-[#7A6FF0] font-semibold text-sm">
          Voltar
        </Link>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#27005D] -ml-8">Produtos</h1>
        <div className="w-12" />
      </div>

      <div className="flex items-center gap-2 px-4 mb-4">
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input type="text" placeholder="Pesquisar...." className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <Button className="rounded-full bg-[#7A6FF0] p-2 min-w-0 h-10 w-10 flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-white" />
        </Button>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-20">
        <Card className="relative p-4 rounded-2xl shadow-md">
          <button className="absolute top-4 right-4 bg-white rounded-full p-1 shadow">
            <Heart className="w-6 h-6 text-[#27005D]" fill="#fff" />
          </button>
          <div className="flex gap-3 items-start">
            <Image
              src={"/fan.jpg"}
              alt="Atkins Jones, Química"
              width={48}
              height={48}
              className="rounded-md object-cover w-12 h-12"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">Atkins Jones, Química</div>
              <div className="text-xs text-gray-500">Vale Sul Shopping, Av. Andrômeda, 227</div>
              <div className="flex gap-1 mt-1">
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">PIZZA</span>
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">Pães</span>
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">Cafés</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  De bizu
                </span>
                <span className="mx-1">•</span>
                <span>HBC 314</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center gap-1 text-[#F7B801]">
                  <Star size={14} />
                  4.5
                </span>
                <span className="text-gray-400">(30+)</span>
                <Link href="#" className="text-[#7A6FF0] underline ml-1">
                  Ver comentários
                </Link>
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-[#27005D] text-white rounded-full py-2 text-sm font-semibold shadow-none"
            variant="outline"
          >
            Mais informações
          </Button>
        </Card>

        <Card className="relative p-4 rounded-2xl shadow-md">
          <button className="absolute top-4 right-4 bg-white rounded-full p-1 shadow">
            <Heart className="w-6 h-6 text-[#27005D]" fill="#fff" />
          </button>
          <div className="flex gap-3 items-start">
            <Image
              src="/fan.jpg"
              alt="Ventilador"
              width={48}
              height={48}
              className="rounded-md object-cover w-12 h-12"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">Ventilador</div>
              <div className="text-xs text-gray-500">Vale Sul Shopping, Av. Andrômeda, 227</div>
              <div className="flex gap-1 mt-1">
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">PIZZA</span>
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">Pães</span>
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">Cafés</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">R$100,00</span>
                <span className="mx-1">•</span>
                <span>HBA 123</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center gap-1 text-[#F7B801]">
                  <Star size={14} />
                  4.5
                </span>
                <span className="text-gray-400">(30+)</span>
                <Link href="#" className="text-[#7A6FF0] underline ml-1">
                  Ver comentários
                </Link>
              </div>
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-[#27005D] text-white rounded-full py-2 text-sm font-semibold shadow-none"
            variant="outline"
          >
            Mais informações
          </Button>
        </Card>

        <Card className="relative p-4 rounded-2xl shadow-md">
          <button className="absolute top-4 right-4 bg-white rounded-full p-1 shadow">
            <Heart className="w-6 h-6 text-[#27005D]" fill="#fff" />
          </button>
          <div className="flex gap-3 items-start">
            <Image
              src="/mattress.jpg"
              alt="Colchão de Casal"
              width={48}
              height={48}
              className="rounded-md object-cover w-12 h-12"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">Colchão de Casal</div>
              <div className="text-xs text-gray-500">Vale Sul Shopping, Av. Andrômeda, 227</div>
              <div className="flex gap-1 mt-1">
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">PIZZA</span>
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">Pães</span>
                <span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[10px]">Cafés</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">R$119,00</span>
                <span className="mx-1">•</span>
                <span>HBB 230</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="flex items-center gap-1 text-[#F7B801]">
                  <Star size={14} />
                  4.5
                </span>
                <span className="text-gray-400">(30+)</span>
                <Link href="#" className="text-[#7A6FF0] underline ml-1">
                  Ver comentários
                </Link>
              </div>
            </div>
          </div>
          <Button className="w-full mt-4 bg-[#27005D] text-white rounded-full py-2 text-sm font-semibold shadow-none">
            Mais informações
          </Button>
        </Card>
      </div>
    </>
  );
}
