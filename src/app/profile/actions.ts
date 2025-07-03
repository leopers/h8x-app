"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

// Schema for updating user profile
const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  image: z.string().optional(),
});

export async function getUserProfile() {
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

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}

export async function updateUserProfile(data: z.infer<typeof updateProfileSchema>) {
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
    const validatedData = updateProfileSchema.parse(data);

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        image: validatedData.image,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Dados inválidos", details: error.errors };
    }
    return { success: false, error: "Failed to update user profile" };
  }
} 