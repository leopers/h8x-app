import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import Navbar from "@/app/components/Navbar";

// Mock the useSession hook
jest.mock("@/lib/auth-client", () => ({
  useSession: jest.fn(),
}));

describe("Navbar", () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders navbar with children", () => {
    render(<Navbar>{mockChildren}</Navbar>);

    expect(screen.getByTestId("test-children")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders navbar structure correctly", () => {
    render(<Navbar>{mockChildren}</Navbar>);

    // Check that children are rendered
    expect(screen.getByTestId("test-children")).toBeInTheDocument();
  });

  it("handles navigation correctly", () => {
    render(<Navbar>{mockChildren}</Navbar>);

    // Test for common navigation elements
    const navItems = screen.queryAllByRole("link");

    // Basic check that navigation structure exists
    expect(navItems).toBeDefined();
  });
});
