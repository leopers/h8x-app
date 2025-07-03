"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

// Schema for sending messages
const sendMessageSchema = z.object({
  productId: z.string().uuid(),
  receiverId: z.string(),
  content: z.string().min(1, "Mensagem não pode estar vazia").max(1000, "Mensagem muito longa"),
});

export async function getProductDetails(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      ...product,
      price: product.price ? product.price / 100 : null, // Convert from cents
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Failed to fetch product details");
  }
}

export async function getOtherSellerProducts(sellerId: string, currentProductId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        sellerId,
        id: {
          not: currentProductId,
        },
      },
      select: {
        id: true,
        name: true,
        s3UrlImage: true,
        price: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map(product => ({
      ...product,
      price: product.price ? product.price / 100 : null,
    }));
  } catch (error) {
    console.error("Error fetching other seller products:", error);
    throw new Error("Failed to fetch other seller products");
  }
}

export async function getOrCreateConversation(productId: string, sellerId: string) {
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

    const buyerId = session.user.id;

    // Check if conversation already exists using raw query
    const existingConversation = await prisma.$queryRaw`
      SELECT 
        c.id,
        c."productId",
        c."buyerId", 
        c."sellerId",
        c."createdAt",
        c."updatedAt"
      FROM conversation c
      WHERE c."productId" = ${productId}
      AND c."buyerId" = ${buyerId}
      AND c."sellerId" = ${sellerId}
      LIMIT 1
    `;

    if (Array.isArray(existingConversation) && existingConversation.length > 0) {
      // Get messages for existing conversation
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
        WHERE m."conversationId" = ${existingConversation[0].id}
        ORDER BY m."createdAt" ASC
      `;

      return {
        ...existingConversation[0],
        messages: messages || [],
      };
    }

    // Create new conversation
    const newConversationId = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO conversation (id, "productId", "buyerId", "sellerId", "createdAt", "updatedAt")
      VALUES (${newConversationId}, ${productId}, ${buyerId}, ${sellerId}, NOW(), NOW())
    `;

    return {
      id: newConversationId,
      productId,
      buyerId,
      sellerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
  } catch (error) {
    console.error("Error getting or creating conversation:", error);
    throw new Error("Failed to get or create conversation");
  }
}

export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
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

    // Validate the input data
    const validatedData = sendMessageSchema.parse(data);

    // Check if user is trying to message themselves
    if (session.user.id === validatedData.receiverId) {
      throw new Error("You cannot send a message to yourself");
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(
      validatedData.productId,
      validatedData.receiverId
    );

    // Create the message using raw query
    const messageId = crypto.randomUUID();
    await prisma.$executeRaw`
      INSERT INTO message (id, "conversationId", "senderId", content, status, "createdAt", "updatedAt")
      VALUES (${messageId}, ${conversation.id}, ${session.user.id}, ${validatedData.content}, 'SENT', NOW(), NOW())
    `;

    // Update conversation's updatedAt timestamp
    await prisma.$executeRaw`
      UPDATE conversation 
      SET "updatedAt" = NOW()
      WHERE id = ${conversation.id}
    `;

    // Get the created message with sender info
    const createdMessage = await prisma.$queryRaw`
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
      WHERE m.id = ${messageId}
    `;

    return { 
      success: true, 
      message: Array.isArray(createdMessage) ? createdMessage[0] : null, 
      conversationId: conversation.id 
    };
  } catch (error) {
    console.error("Error sending message:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Dados inválidos", details: error.errors };
    }
    return { success: false, error: error instanceof Error ? error.message : "Failed to send message" };
  }
}

export async function getConversationMessages(conversationId: string) {
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

    // Mark messages as read
    await prisma.$executeRaw`
      UPDATE message 
      SET status = 'READ'
      WHERE "conversationId" = ${conversationId}
      AND "senderId" != ${userId}
      AND status != 'read'
    `;

    return {
      ...conversation[0],
      messages: messages || [],
    };
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    throw new Error("Failed to fetch conversation messages");
  }
}

export async function getCurrentUser() {
  try {
    // Get current user session
    const cookieStore = await cookies();
    const headers = new Headers();
    cookieStore.getAll().forEach(cookie => {
      headers.append('cookie', `${cookie.name}=${cookie.value}`);
    });
    const session = await auth.api.getSession({ headers });
    
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
} 