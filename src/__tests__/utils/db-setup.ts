import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

// Mock the prisma client
export const prismaMock = mockDeep<PrismaClient>();

// Reset the mock between tests
beforeEach(() => {
  mockReset(prismaMock);
});

// Mock the prisma import
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));

// Database test utilities
export const dbTestUtils = {
  // Create a test user
  createTestUser: () => ({
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  // Create a test product
  createTestProduct: () => ({
    id: "test-product-id",
    name: "Test Product",
    description: "A test product",
    price: 1000, // $10.00 in cents
    status: "ACTIVE" as const,
    sellerId: "test-user-id",
    s3UrlImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  // Create a test session
  createTestSession: () => ({
    id: "test-session-id",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
    token: "test-token",
    createdAt: new Date(),
    updatedAt: new Date(),
    ipAddress: "127.0.0.1",
    userAgent: "test-agent",
    userId: "test-user-id",
  }),

  // Create a test conversation
  createTestConversation: () => ({
    id: "test-conversation-id",
    productId: "test-product-id",
    buyerId: "test-buyer-id",
    sellerId: "test-seller-id",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  // Create a test message
  createTestMessage: () => ({
    id: "test-message-id",
    conversationId: "test-conversation-id",
    senderId: "test-user-id",
    content: "Test message content",
    status: "SENT" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};

export default prismaMock;
