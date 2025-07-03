"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { getConversationWithMessages } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react"

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  sender_name: string
  sender_image: string | null
}

interface Conversation {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  createdAt: string
  updatedAt: string
  product_name: string
  product_image: string | null
  buyer_name: string
  buyer_image: string | null
  seller_name: string
  seller_image: string | null
}

interface ConversationWithMessages {
  conversation: Conversation
  messages: any[]
  currentUserId: string
}

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params?.id as string

  const [conversationData, setConversationData] = useState<ConversationWithMessages | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!conversationId) {
      setError("ID da conversa não fornecido")
      setIsLoading(false)
      return
    }

    loadConversation(true)

    const interval = setInterval(() => {
      if (!document.hidden) {
        loadConversation(false)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    if (conversationData?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [conversationData])

  const loadConversation = async (showLoader = false) => {
    try {
      if (showLoader) {
        setIsLoading(true)
      } else {
        setIsUpdating(true)
      }
      setError(null)
      const data = await getConversationWithMessages(conversationId)
      setConversationData(data)
    } catch (error) {
      console.error("Error loading conversation:", error)
      if (showLoader) {
        setError("Erro ao carregar conversa")
      }
    } finally {
      if (showLoader) {
        setIsLoading(false)
      } else {
        setIsUpdating(false)
      }
    }
  }

  const handleSend = async () => {
    if (!message.trim() || isSending) return

    const messageToSend = message.trim()
    setMessage("")
    setIsSending(true)

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: messageToSend }),
      })

      if (res.ok) {
        await loadConversation(false)
        inputRef.current?.focus()
      } else {
        setMessage(messageToSend)
        setError("Erro ao enviar mensagem. Tente novamente.")
        setTimeout(() => setError(null), 3000)
      }
    } catch (error) {
      setMessage(messageToSend)
      setError("Erro de conexão. Tente novamente.")
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-medium">Carregando conversa...</p>
            <p className="text-slate-500 text-sm">Aguarde um momento</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !conversationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <p className="text-red-600 font-medium">{error || "Conversa não encontrada"}</p>
            <Button
              onClick={() => loadConversation(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!conversationData?.conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-600">Conversa não encontrada</p>
          <Button
            onClick={() => router.back()}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-full"
          >
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const { conversation, messages, currentUserId } = conversationData

  const otherUser = {
    id: currentUserId === conversation.buyerId ? conversation.sellerId : conversation.buyerId,
    name: currentUserId === conversation.buyerId ? conversation.seller_name : conversation.buyer_name,
    image: currentUserId === conversation.buyerId ? conversation.seller_image : conversation.buyer_image,
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex flex-col overflow-hidden">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm"></div>
        <div className="relative px-4 py-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20} />
            </Button>

            <div className="flex items-center gap-3 flex-1 mx-4">
              <div className="relative">
                <Avatar className="w-11 h-11 ring-2 ring-white/30 transition-all duration-200 hover:ring-white/50">
                  <AvatarImage src={otherUser.image || undefined} alt={otherUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-white/20 to-white/10 text-white font-semibold text-sm backdrop-blur-sm">
                    {getInitials(otherUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-white text-base truncate">{otherUser.name}</span>
                <div className="flex items-center gap-2">
                  {isUpdating ? (
                    <span className="text-xs text-white/80 flex items-center gap-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      Atualizando...
                    </span>
                  ) : (
                    <span className="text-xs text-white/80">Online agora</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <Phone size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <Video size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-md mx-auto w-full custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.3);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.5);
          }
        `}</style>

        <div className="flex flex-col gap-3 pb-4">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const isMe = msg.senderId === currentUserId
              const nextMessage = messages[index + 1]
              const isLastInGroup = !nextMessage || nextMessage.senderId !== msg.senderId

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMe && isLastInGroup && (
                      <Avatar className="w-8 h-8 mb-1 flex-shrink-0 ring-2 ring-white shadow-sm">
                        <AvatarImage src={msg.sender_image || undefined} alt={msg.sender_name} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white text-xs font-medium">
                          {getInitials(msg.sender_name)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`relative px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
                        isMe
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md shadow-blue-200/50"
                          : "bg-white/90 text-slate-800 border border-slate-200/50 rounded-bl-md shadow-slate-200/50"
                      } ${!isMe && !isLastInGroup ? "ml-10" : ""}`}
                    >
                      {!isMe && (index === 0 || messages[index - 1]?.senderId !== msg.senderId) && (
                        <div className="text-xs font-semibold text-blue-600 mb-2">{msg.sender_name}</div>
                      )}

                      <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                      <div className={`flex items-center gap-2 mt-2 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[10px] font-medium ${isMe ? "text-blue-100" : "text-slate-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {isMe && (
                          <div className="flex items-center">
                            {(msg.status === "read" || msg.status === "READ") && (
                              <div className="flex">
                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <svg className="w-3 h-3 text-blue-200 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            {(msg.status === "DELIVERED" || msg.status === "delivered") && (
                              <div className="flex">
                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <svg className="w-3 h-3 text-blue-200 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            {(msg.status === "SENT" || msg.status === "sent") && (
                              <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto">
                <Send size={24} className="text-slate-500" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-600 font-medium">Nenhuma mensagem ainda</p>
                <p className="text-slate-500 text-sm">Envie a primeira mensagem para começar a conversa</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Message */}
      {error && conversationData && (
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-red-700 text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Modern Input Area */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 px-4 py-4 flex-shrink-0 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Digite uma mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="rounded-full border-slate-300 bg-white/90 focus:border-blue-500 focus:ring-blue-500/20 py-3 px-5 pr-12 shadow-sm backdrop-blur-sm transition-all duration-200 focus:shadow-md"
                maxLength={1000}
                disabled={isSending}
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                {message.length}/1000
              </div>
            </div>

            <Button
              onClick={handleSend}
              disabled={isSending || !message.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 rounded-full p-3 min-w-[52px] h-12 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100"
              size="sm"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
