import Image from "next/image";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="mb-10">
      <div className="relative">
        <div className="bg-white px-4 pb-6">
          <div className="flex flex-col items-center ">
            <Avatar className="w-[100px] h-[100px] border-4 border-white rounded-full">
              <AvatarImage src="/profile-placeholder.jpg" alt="Baby" />
            </Avatar>
            <h1 className="mt-3 text-lg font-semibold">Baby</h1>
            <p className="text-sm text-gray-600">baby126@email.com</p>

            <div className="flex items-center gap-1 mt-1 text-gray-600">
              <MapPin size={14} />
              <span className="text-sm">São José dos Campos</span>
            </div>

            <div className="flex gap-12 mt-4">
              <div className="text-center">
                <div className="font-semibold text-lg">12</div>
                <div className="text-sm text-gray-600">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">13</div>
                <div className="text-sm text-gray-600">Seguindo</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">10</div>
                <div className="text-sm text-gray-600">Tópicos</div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 w-full max-w-[280px]">
              <Button
                variant="outline"
                className="flex-1 h-9 bg-[#27005D] text-white border-none hover:bg-[#27005D]/30 text-sm"
              >
                Editar Perfil
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-9 bg-[#27005D] text-white border-none hover:bg-[#27005D]/30 text-sm"
              >
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 mt-4">
        <h2 className="text-base font-semibold mb-3">Itens à venda</h2>
        <div className="grid grid-cols-3 gap-2">
          <Link href="/products/1">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="aspect-square relative">
                <Image src="/atkins.jpg" alt="Princípios de Química" fill className="object-cover" />
              </div>
            </Card>
          </Link>

          <Link href="/products/2">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="aspect-square relative">
                <Image src="/camera.jpg" alt="Camera Lens" fill className="object-cover" />
              </div>
            </Card>
          </Link>

          <Link href="/products/3">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="aspect-square relative">
                <Image src="/mattress.jpg" alt="Mattress" fill className="object-cover" />
              </div>
            </Card>
          </Link>
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
