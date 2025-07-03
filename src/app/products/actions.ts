"use server";

import prisma from "@/lib/prisma";
import { createProductSchema } from "./schemas";
import { z } from "zod";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const postProduct = async (product: z.infer<typeof createProductSchema>) => {
  try {
    // Get current user session from Google auth
    const cookieStore = await cookies();
    const headers = new Headers();
    cookieStore.getAll().forEach(cookie => {
      headers.append('cookie', `${cookie.name}=${cookie.value}`);
    });
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // 1. Validate the product
    const validatedProduct = createProductSchema.parse(product);
    
    // 2. Convert price to cents (integer) for storage
    const priceInCents = validatedProduct.price ? Math.round(validatedProduct.price * 100) : null;
    
    // 3. Save the first image as base64 in the database
    const firstImage = validatedProduct.imagesBase64[0] || null;
    
    // 4. Create the product in the database using the authenticated user
    const createdProduct = await prisma.product.create({
      data: {
        name: validatedProduct.name,
        description: validatedProduct.description,
        price: priceInCents,
        s3UrlImage: firstImage, // Temporarily using this field to store base64 image
        sellerId: session.user.id,
      },
    });

    return { success: true, product: createdProduct };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};
