"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, X, Phone, Mail, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  product: {
    id: string;
    name: string;
  };
  onSendMessage: (message: string) => Promise<void>;
  isSendingMessage: boolean;
}

export default function ChatModal({ 
  isOpen, 
  onClose, 
  seller, 
  product, 
  onSendMessage,
  isSendingMessage 
}: ChatModalProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      await onSendMessage(message.trim());
      setMessage("");
      
      // After sending first message, redirect to conversation page
      // We'll need to get conversation ID from the response
      onClose();
      router.push(`/profile/conversations`);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleOpenConversation = () => {
    onClose();
    router.push(`/profile/conversations`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop with gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal with slide-up animation */}
      <div className="relative w-full max-w-md mx-4 mb-0 animate-in slide-in-from-bottom-full duration-300">
        <Card className="w-full rounded-t-3xl rounded-b-none shadow-2xl border-0 overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-[#27005D] to-[#4A0E83] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg">
                    <AvatarImage src={seller.image || undefined} alt={seller.name} />
                    <AvatarFallback className="bg-white text-[#27005D] font-semibold">
                      {getInitials(seller.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-white">
                  <h3 className="font-semibold text-base">{seller.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                    <span>•</span>
                    <span>Vendedor</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Phone size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Mail size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose} 
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full ml-1"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>
            
            {/* Product info */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/90">
                <MessageCircle size={14} />
                <span className="text-sm">Conversa sobre: <span className="font-medium">"{product.name}"</span></span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-gray-50 px-4 py-6 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {/* Welcome message with better design */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl p-4 shadow-sm border max-w-xs">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MessageCircle size={16} className="text-white" />
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Olá! Que bom ter você aqui. Como posso ajudar com o produto <span className="font-medium text-[#27005D]">"{product.name}"</span>?
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-1">
                  ⚡ Ações Rápidas
                </p>
                
                {/* Open conversation button */}
                <Button
                  onClick={handleOpenConversation}
                  className="w-full bg-gradient-to-r from-[#27005D] to-[#4A0E83] hover:from-[#4A0E83] hover:to-[#27005D] text-white rounded-xl p-3 flex items-center gap-3 justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  <span>Ver conversas existentes</span>
                </Button>

                {/* Suggested messages with improved design */}
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide px-1 mt-4">
                  💬 Mensagens Rápidas
                </p>
                <div className="grid gap-2">
                  {[
                    { text: "👋 Olá! Tenho interesse no produto.", icon: "👋" },
                    { text: "🔍 O produto ainda está disponível?", icon: "🔍" },
                    { text: "💰 Podemos negociar o preço?", icon: "💰" },
                    { text: "📅 Quando posso ver o produto?", icon: "📅" }
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group w-full text-left bg-white hover:bg-gradient-to-r hover:from-[#27005D] hover:to-[#4A0E83] rounded-xl p-3 text-sm text-gray-700 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md border hover:border-transparent transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{suggestion.icon}</span>
                        <span className="group-hover:text-white">{suggestion.text.slice(2)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Message Input with improved design */}
          <div className="bg-white border-t p-4">
            <div className="space-y-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-[#27005D] transition-colors text-sm bg-gray-50 focus:bg-white"
                    maxLength={500}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                    {message.length}/500
                  </div>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={isSendingMessage || !message.trim()}
                  className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#27005D] to-[#4A0E83] hover:from-[#4A0E83] hover:to-[#27005D] disabled:from-gray-300 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isSendingMessage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </div>
              
              {/* Help text with better styling */}
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Mensagem para {seller.name}
                </p>
                <p className="text-gray-400">Enter para enviar</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 