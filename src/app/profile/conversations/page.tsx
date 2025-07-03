"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Clock } from "lucide-react";
import { getUserConversations } from "./actions";

interface ConversationData {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  product_name: string;
  product_image: string | null;
  buyer_name: string;
  buyer_image: string | null;
  seller_name: string;
  seller_image: string | null;
  last_message: string | null;
  last_message_at: Date | null;
  unread_count: number;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getUserConversations();
      console.log("Conversations loaded:", data); // Debug log
      setConversations(data as ConversationData[]);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setError(`Erro ao carregar conversas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
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

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}min atrás`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else {
      return messageDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const getOtherUser = (conversation: ConversationData, currentUserId: string) => {
    // Get current user ID would need to be passed or fetched
    // For now, we'll use a placeholder approach
    return {
      id: conversation.buyerId === currentUserId ? conversation.sellerId : conversation.buyerId,
      name: conversation.buyerId === currentUserId ? conversation.seller_name : conversation.buyer_name,
      image: conversation.buyerId === currentUserId ? conversation.seller_image : conversation.buyer_image,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#27005D] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadConversations} className="mt-2">
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
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Conversas</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa ainda</h3>
            <p className="text-gray-500 text-sm mb-6">
              Suas conversas com compradores e vendedores aparecerão aqui
            </p>
            <Link href="/products">
              <Button className="bg-[#27005D] hover:bg-[#27005D]/90">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              // For now, we'll assume current user based on context
              // In a real app, you'd get this from the session
              const otherUser = getOtherUser(conversation, "placeholder");
              
              return (
                <Link
                  key={conversation.id}
                  href={`/profile/conversations/${conversation.id}`}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                    <div className="flex items-start gap-3">
                      {/* User Avatar */}
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src={otherUser.image || undefined} 
                            alt={otherUser.name} 
                          />
                          <AvatarFallback className="bg-[#27005D] text-white">
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
                          </div>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherUser.name}
                          </h3>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(conversation.last_message_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                            {conversation.product_image ? (
                              <Image
                                src={conversation.product_image}
                                alt={conversation.product_name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300"></div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 truncate">
                            {conversation.product_name}
                          </span>
                        </div>

                        {conversation.last_message && (
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.last_message}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 