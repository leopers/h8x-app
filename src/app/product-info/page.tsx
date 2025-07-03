"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, ArrowLeft, MessageCircle, Send, Phone, Mail, ChevronRight } from "lucide-react";
import { getProductDetails, getOtherSellerProducts, getCurrentUser, sendMessage } from "./actions";
import ChatModal from "./components/ChatModal";

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  s3UrlImage: string | null;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  seller: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface OtherProduct {
  id: string;
  name: string;
  s3UrlImage: string | null;
  price: number | null;
}

function ProductInfoContent() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("id");

  const [product, setProduct] = useState<ProductData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [otherProducts, setOtherProducts] = useState<OtherProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [showChatModal, setShowChatModal] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProductData();
    } else {
      setError("ID do produto não fornecido");
      setIsLoading(false);
    }
  }, [productId]);

  const loadProductData = async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      const [productData, userData] = await Promise.all([getProductDetails(productId), getCurrentUser()]);

      setProduct(productData);
      setCurrentUser(userData);

      // Load other seller products
      if (productData) {
        const otherSellerProducts = await getOtherSellerProducts(productData.seller.id, productId);
        setOtherProducts(otherSellerProducts);
      }
    } catch (error) {
      console.error("Error loading product data:", error);
      setError("Erro ao carregar produto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || !product || !currentUser) return;

    try {
      setIsSendingMessage(true);
      const result = await sendMessage({
        productId: product.id,
        receiverId: product.seller.id,
        content: messageContent.trim(),
      });

      if (result.success) {
        // Here you would normally update the chat UI
        alert("Mensagem enviada! O vendedor entrará em contato.");
        setShowChatModal(false);
      } else {
        alert(result.error || "Erro ao enviar mensagem");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Erro ao enviar mensagem");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Preço a combinar";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const generateCode = (id: string) => {
    const prefix = ["HBC", "HBA", "HBB"][Math.floor(Math.random() * 3)];
    const suffix = id.slice(-3).toUpperCase();
    return `${prefix} ${suffix}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27005D] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Produto não encontrado"}</p>
          <Link href="/products">
            <Button className="mt-2">Voltar aos produtos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === product.seller.id;

  return (
    <div className="bg-gray-50 pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Detalhes do Produto</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Product Image */}
      <div className="p-4 bg-white shadow-sm">
        <div className="aspect-square max-w-xs mx-auto rounded-xl overflow-hidden bg-gray-200">
          {product.s3UrlImage ? (
            <Image
              src={product.s3UrlImage}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span className="text-center p-4">Sem imagem disponível</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <MapPin size={14} className="mr-1" />
              {generateCode(product.id)}
            </div>
            <div>{new Date(product.createdAt).toLocaleDateString("pt-BR")}</div>
          </div>

          <h1 className="text-xl font-semibold text-[#27005D] mb-1">{product.name}</h1>
          <p className="text-2xl font-bold text-gray-800 mb-2">{formatPrice(product.price)}</p>

          {product.description && <p className="text-gray-600 text-sm mb-4">{product.description}</p>}

          {/* Seller info */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={product.seller.image || undefined} alt={product.seller.name} />
                <AvatarFallback className="bg-[#27005D] text-white">{getInitials(product.seller.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{product.seller.name}</p>
                <div className="flex items-center text-sm text-yellow-600">
                  <Star size={14} className="mr-1" fill="currentColor" />
                  <span>4.5</span>
                  <span className="text-gray-500 ml-1">vendedor</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <Mail size={16} />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Phone size={16} />
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          {!isOwner && (
            <div className="flex gap-3">
              <Button
                onClick={() => setShowChatModal(true)}
                className="flex-1 bg-[#27005D] hover:bg-[#27005D]/90 flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Chat com Vendedor
              </Button>
            </div>
          )}

          {isOwner && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-blue-800 text-sm font-medium">Este é o seu produto</p>
            </div>
          )}
        </div>
      </div>

      {/* Other seller products */}
      {otherProducts.length > 0 && (
        <div className="p-4 mt-2 bg-white shadow-sm">
          <h2 className="text-md font-semibold text-[#27005D] mb-3">Outros produtos de {product.seller.name}</h2>
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {otherProducts.map((otherProduct) => (
              <Link href={`/product-info?id=${otherProduct.id}`} key={otherProduct.id} className="flex-shrink-0">
                <Card className="w-[100px] overflow-hidden rounded-lg shadow-md border-0">
                  <div className="aspect-square relative">
                    {otherProduct.s3UrlImage ? (
                      <Image src={otherProduct.s3UrlImage} alt={otherProduct.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs text-center p-1">{otherProduct.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{otherProduct.name}</p>
                    <p className="text-xs text-[#27005D] font-semibold">{formatPrice(otherProduct.price)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to products */}
      <div className="px-4 mt-4">
        <Link href="/products" className="block">
          <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-xl font-bold text-[#27005D]">H8</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Explorar</span>
                <span className="text-sm text-[#27005D] font-semibold">Ver todos os produtos</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-[#27005D] rounded-lg flex items-center justify-center">
              <ChevronRight size={16} className="text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        seller={product.seller}
        product={{ id: product.id, name: product.name }}
        onSendMessage={handleSendMessage}
        isSendingMessage={isSendingMessage}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27005D] mx-auto"></div>
        <p className="mt-2 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

export default function ProductInfo() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductInfoContent />
    </Suspense>
  );
}
