// Session type based on better-auth structure
interface MockSession {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string;
    userAgent: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Mock auth utilities
export const authTestUtils = {
  // Create a mock authenticated session
  createMockSession: (overrides?: Partial<MockSession>): MockSession => ({
    session: {
      id: "test-session-id",
      userId: "test-user-id",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
      token: "test-token",
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
    },
    user: {
      id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ...overrides,
  }),

  // Create a mock unauthenticated session
  createMockUnauthenticatedSession: (): null => null,

  // Mock the auth client
  mockAuthClient: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    useSession: jest.fn(),
    getSession: jest.fn(),
  },
};

// Mock the auth client module
jest.mock("@/lib/auth-client", () => ({
  signIn: authTestUtils.mockAuthClient.signIn,
  signOut: authTestUtils.mockAuthClient.signOut,
  signUp: authTestUtils.mockAuthClient.signUp,
  useSession: authTestUtils.mockAuthClient.useSession,
  getSession: authTestUtils.mockAuthClient.getSession,
}));

// Mock the auth module
jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: authTestUtils.mockAuthClient.getSession,
    },
  },
}));

export default authTestUtils;
