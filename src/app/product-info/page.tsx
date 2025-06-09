"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

const products = [
  { name: "Princípios de Química", image: "/atkins.jpg" },
  { name: "Ventilador", image: "/fan.jpg" },
  { name: "Colchão de Casal", image: "/mattress.jpg" },
  { name: "Câmera Sony", image: "/camera.jpg" },
];

export default function ProductInfo() {
  return (
    <div className="bg-gray-50 pb-20">
      <div className="p-4 bg-white shadow-sm ">
        <Image className="w-50 h-50 rounded-full mx-auto" src="/camera.jpg" alt="Camera" width={100} height={100} />
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            H8A, 123
          </div>
          <div>(35) 99999 - 9999</div>
        </div>

        <h1 className="text-xl font-semibold text-[#27005D] mb-1">SONY 200mm Zoom</h1>
        <p className="text-2xl font-bold text-gray-800 mb-2">R$40.000</p>

        <div className="flex items-center text-sm mb-4">
          <Star size={18} className="text-yellow-400 mr-1" fill="#FDE047" />
          <span className="font-semibold mr-1">4.5</span>
          <span className="text-gray-500">Avaliação vendedor</span>
        </div>
      </div>

      <div className="p-4 mt-2 bg-white shadow-sm">
        <h2 className="text-md font-semibold text-[#27005D] mb-3">Outros Produtos</h2>
        <div className="flex overflow-x-auto space-x-3 pb-2">
          {products.map((product, index) => (
            <Link href="#" key={index} className="flex-shrink-0">
              <Card className="w-[100px] h-[100px] overflow-hidden rounded-lg shadow-md border-0">
                <div className="relative w-full h-full">
                  <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <Link href="/products" className="block">
          <div className="bg-white rounded-xl p-1 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-xl font-bold text-[#27005D]">H8</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Adquira</span>
                <span className="text-sm text-[#27005D] font-semibold">Ver mais produtos</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-[#27005D] rounded-lg"></div>
          </div>
        </Link>
      </div>
    </div>
  );
}
