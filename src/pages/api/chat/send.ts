import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { conversationId, content } = req.body;
    if (!conversationId || !content) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Get current user session using a simplified approach
    let session;
    try {
      // Create headers from request
      const headers = new Headers();
      if (req.headers.cookie) {
        headers.append('cookie', req.headers.cookie);
      }
      session = await auth.api.getSession({ headers });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ error: "Authentication failed" });
    }
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    
    // Find conversation and verify user is part of it
    const conversationResult = await prisma.$queryRaw`
      SELECT "productId", "buyerId", "sellerId" 
      FROM conversation 
      WHERE id = ${conversationId}
      AND ("buyerId" = ${userId} OR "sellerId" = ${userId})
      LIMIT 1
    `;
    
    if (!Array.isArray(conversationResult) || conversationResult.length === 0) {
      return res.status(404).json({ error: "Conversation not found or unauthorized" });
    }
    
    const conversation = conversationResult[0] as { productId: string; buyerId: string; sellerId: string };
    
    // Create message directly
    const messageResult = await prisma.$queryRaw`
      INSERT INTO message ("id", "conversationId", "senderId", "content", "status", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${conversationId}, ${userId}, ${content}, 'SENT', NOW(), NOW())
      RETURNING id
    `;
    
    if (!Array.isArray(messageResult) || messageResult.length === 0) {
      return res.status(500).json({ error: "Failed to create message" });
    }
    
    // Update conversation updatedAt
    await prisma.$executeRaw`
      UPDATE conversation 
      SET "updatedAt" = NOW()
      WHERE id = ${conversationId}
    `;
    
    return res.status(200).json({ 
      success: true,
      messageId: (messageResult[0] as any).id 
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
} 