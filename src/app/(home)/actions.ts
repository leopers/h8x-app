"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getUserHomeData() {
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

    // Get user data
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
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's products
    const products = await prisma.product.findMany({
      where: {
        sellerId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        s3UrlImage: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6, // Show only first 6 products on home
    });

    return {
      user,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price ? product.price / 100 : null, // Convert from cents
        s3UrlImage: product.s3UrlImage,
        createdAt: product.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching user home data:", error);
    throw new Error("Failed to fetch user home data");
  }
}
