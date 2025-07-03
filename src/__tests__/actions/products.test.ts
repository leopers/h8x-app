import { prismaMock, dbTestUtils } from "../utils/db-setup";
import { getProducts, postProduct } from "@/app/products/actions";
import { createProductSchema } from "@/app/products/schemas";

// Mock the auth module
jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

// Mock Next.js headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("Products Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should return products with seller information", async () => {
      const mockProducts = [
        {
          ...dbTestUtils.createTestProduct(),
          seller: {
            id: "test-user-id",
            name: "Test User",
            email: "test@example.com",
          },
        },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);

      const result = await getProducts();

      expect(result).toEqual(mockProducts);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
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
    });

    it("should handle database errors", async () => {
      prismaMock.product.findMany.mockRejectedValue(
        new Error("Database error")
      );

      await expect(getProducts()).rejects.toThrow("Failed to fetch products");
    });
  });

  describe("postProduct", () => {
    const mockProductData = {
      name: "Test Product",
      description: "A test product",
      price: 10.0,
      imagesBase64: ["base64-image-data"],
    };

    it("should create a product successfully", async () => {
      const mockSession = {
        user: { id: "test-user-id" },
      };

      // Mock the auth session
      const { auth } = require("@/lib/auth");
      auth.api.getSession.mockResolvedValue(mockSession);

      // Mock cookies
      const { cookies } = require("next/headers");
      cookies.mockResolvedValue({
        getAll: jest
          .fn()
          .mockReturnValue([{ name: "session-token", value: "mock-token" }]),
      });

      const mockCreatedProduct = {
        id: "test-product-id",
        name: mockProductData.name,
        description: mockProductData.description,
        price: 1000, // $10.00 in cents
        status: "ACTIVE" as const,
        s3UrlImage: mockProductData.imagesBase64[0],
        sellerId: "test-user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.product.create.mockResolvedValue(mockCreatedProduct);

      const result = await postProduct(mockProductData);

      expect(result).toEqual({
        success: true,
        product: mockCreatedProduct,
      });

      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: {
          name: mockProductData.name,
          description: mockProductData.description,
          price: 1000, // Converted to cents
          s3UrlImage: mockProductData.imagesBase64[0],
          sellerId: "test-user-id",
        },
      });
    });

    it("should throw error when user is not authenticated", async () => {
      // Mock no session
      const { auth } = require("@/lib/auth");
      auth.api.getSession.mockResolvedValue(null);

      // Mock cookies
      const { cookies } = require("next/headers");
      cookies.mockResolvedValue({
        getAll: jest.fn().mockReturnValue([]),
      });

      await expect(postProduct(mockProductData)).rejects.toThrow(
        "Failed to create product"
      );
    });

    it("should handle validation errors", async () => {
      const invalidProductData = {
        name: "", // Invalid - empty name
        description: "A test product",
        price: -10, // Invalid - negative price
        imagesBase64: [],
      };

      await expect(postProduct(invalidProductData)).rejects.toThrow(
        "Failed to create product"
      );
    });

    it("should handle database errors", async () => {
      const mockSession = {
        user: { id: "test-user-id" },
      };

      // Mock the auth session
      const { auth } = require("@/lib/auth");
      auth.api.getSession.mockResolvedValue(mockSession);

      // Mock cookies
      const { cookies } = require("next/headers");
      cookies.mockResolvedValue({
        getAll: jest
          .fn()
          .mockReturnValue([{ name: "session-token", value: "mock-token" }]),
      });

      prismaMock.product.create.mockRejectedValue(new Error("Database error"));

      await expect(postProduct(mockProductData)).rejects.toThrow(
        "Failed to create product"
      );
    });
  });
});
