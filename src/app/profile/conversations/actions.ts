"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getUserConversations() {
  try {
    // Get current user session
    const cookieStore = await cookies();
    const headers = new Headers();
    cookieStore.getAll().forEach(cookie => {
      headers.append('cookie', `${cookie.name}=${cookie.value}`);
    });
    const session = await auth.api.getSession({ headers });
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Get all conversations where user is either buyer or seller
    const conversations = await prisma.$queryRaw`
      SELECT 
        c.id,
        c."productId",
        c."buyerId", 
        c."sellerId",
        c."createdAt",
        c."updatedAt",
        p.name as product_name,
        p."s3UrlImage" as product_image,
        buyer.name as buyer_name,
        buyer.image as buyer_image,
        seller.name as seller_name,
        seller.image as seller_image,
        (
          SELECT m.content 
          FROM message m 
          WHERE m."conversationId" = c.id 
          ORDER BY m."createdAt" DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT m."createdAt" 
          FROM message m 
          WHERE m."conversationId" = c.id 
          ORDER BY m."createdAt" DESC 
          LIMIT 1
        ) as last_message_at,
        (
          SELECT COUNT(*)::int
          FROM message m 
          WHERE m."conversationId" = c.id 
          AND m."senderId" != ${userId}
          AND m.status != 'READ'
        ) as unread_count
      FROM conversation c
      JOIN product p ON c."productId" = p.id
      JOIN "user" buyer ON c."buyerId" = buyer.id
      JOIN "user" seller ON c."sellerId" = seller.id
      WHERE c."buyerId" = ${userId} OR c."sellerId" = ${userId}
      ORDER BY COALESCE(
        (SELECT m."createdAt" FROM message m WHERE m."conversationId" = c.id ORDER BY m."createdAt" DESC LIMIT 1),
        c."updatedAt"
      ) DESC
    `;

    return conversations;
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    throw new Error("Failed to fetch conversations");
  }
}

interface ConversationWithMessagesResult {
  conversation: any;
  messages: any[];
  currentUserId: string;
}

export async function getConversationWithMessages(conversationId: string): Promise<ConversationWithMessagesResult> {
  try {
    // Get current user session
    const cookieStore = await cookies();
    const headers = new Headers();
    cookieStore.getAll().forEach(cookie => {
      headers.append('cookie', `${cookie.name}=${cookie.value}`);
    });
    const session = await auth.api.getSession({ headers });
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    // Get conversation with messages using raw query
    const conversation = await prisma.$queryRaw`
      SELECT 
        c.id,
        c."productId",
        c."buyerId", 
        c."sellerId",
        c."createdAt",
        c."updatedAt",
        p.name as product_name,
        p."s3UrlImage" as product_image,
        buyer.name as buyer_name,
        buyer.image as buyer_image,
        seller.name as seller_name,
        seller.image as seller_image
      FROM conversation c
      JOIN product p ON c."productId" = p.id
      JOIN "user" buyer ON c."buyerId" = buyer.id
      JOIN "user" seller ON c."sellerId" = seller.id
      WHERE c.id = ${conversationId}
      AND (c."buyerId" = ${userId} OR c."sellerId" = ${userId})
    `;

    if (!Array.isArray(conversation) || conversation.length === 0) {
      throw new Error("Conversation not found or unauthorized");
    }

    // Get messages for this conversation
    const messages = await prisma.$queryRaw`
      SELECT 
        m.id,
        m."conversationId",
        m."senderId",
        m.content,
        m.status,
        m."createdAt",
        m."updatedAt",
        sender.name as sender_name,
        sender.image as sender_image
      FROM message m
      JOIN "user" sender ON m."senderId" = sender.id
      WHERE m."conversationId" = ${conversationId}
      ORDER BY m."createdAt" ASC
    `;

    // Mark messages as read - simplified query without cast
    try {
      await prisma.$executeRaw`
        UPDATE message 
        SET status = 'READ'
        WHERE "conversationId" = ${conversationId}
        AND "senderId" != ${userId}
        AND status != 'READ'
      `;
    } catch (updateError) {
      console.warn("Error updating message status:", updateError);
      // Continue execution even if status update fails
    }

    return {
      conversation: conversation[0],
      messages: Array.isArray(messages) ? messages : [],
      currentUserId: userId, // Add current user ID to help with UI logic
    };
  } catch (error) {
    console.error("Error fetching conversation with messages:", error);
    throw new Error("Failed to fetch conversation");
  }
} 