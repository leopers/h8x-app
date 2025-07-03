import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { AuthProvider } from "@/contexts/auth";
import { authTestUtils } from "./auth-utils";

// Mock the auth context
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-auth-provider">{children}</div>;
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    withAuth?: boolean;
    mockSession?: any;
  }
) => {
  const {
    withAuth = false,
    mockSession = null,
    ...renderOptions
  } = options || {};

  // Setup auth mock if needed
  if (withAuth) {
    authTestUtils.mockAuthClient.useSession.mockReturnValue({
      data: mockSession || authTestUtils.createMockSession(),
      isPending: false,
      error: null,
    });
  } else {
    authTestUtils.mockAuthClient.useSession.mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    });
  }

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Export testing utilities
export * from "@testing-library/react";
export { customRender as render };

// Common test utilities
export const testUtils = {
  // Wait for async operations
  waitFor: async (callback: () => void | Promise<void>, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timeout after ${timeout}ms`));
      }, timeout);

      const checkCondition = async () => {
        try {
          await callback();
          clearTimeout(timeoutId);
          resolve(true);
        } catch (error) {
          setTimeout(checkCondition, 100);
        }
      };

      checkCondition();
    });
  },

  // Create mock form data
  createMockFormData: (data: Record<string, any>) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return formData;
  },

  // Mock fetch response
  mockFetchResponse: (data: any, status = 200) => {
    return Promise.resolve({
      ok: status < 400,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
    } as Response);
  },

  // Mock file for file upload testing
  createMockFile: (name = "test.jpg", size = 1024, type = "image/jpeg") => {
    return new File(["test content"], name, { type, lastModified: Date.now() });
  },
};

export default testUtils;
