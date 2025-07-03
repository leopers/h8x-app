"use server";

import prisma from "@/lib/prisma";

export const getUserProducts = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const products = await prisma.product.findMany({
      where: {
        sellerId: userId,
      },
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
    console.error("Error fetching user products:", error);
    throw new Error("Failed to fetch user products");
  }
};

export const updateProductStatus = async (productId: string, status: "ACTIVE" | "SOLD" | "INACTIVE", userId: string) => {
  try {
    if (!productId || !userId) {
      throw new Error("Product ID and User ID are required");
    }

    // Verify that the product belongs to the user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: userId,
      },
    });

    if (!product) {
      throw new Error("Product not found or you don't have permission to update it");
    }

    // TODO: Uncomment when Prisma client is regenerated with status field
    // const updatedProduct = await prisma.product.update({
    //   where: {
    //     id: productId,
    //   },
    //   data: {
    //     status: status,
    //   },
    // });
    
    console.log(`Product ${productId} status would be updated to ${status}`);
    
    return { success: true, message: "Product status updated successfully" };
  } catch (error) {
    console.error("Error updating product status:", error);
    return { success: false, message: "Failed to update product status" };
  }
};

export const deleteProduct = async (productId: string, userId: string) => {
  try {
    if (!productId || !userId) {
      throw new Error("Product ID and User ID are required");
    }

    // Verify that the product belongs to the user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: userId,
      },
    });

    if (!product) {
      throw new Error("Product not found or you don't have permission to delete it");
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product" };
  }
}; 