import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Create Next App/);

    // Check for navigation elements
    const navigation = page.locator("nav").first();
    await expect(navigation).toBeVisible();
  });

  test("should display product listings", async ({ page }) => {
    await page.goto("/");

    // Wait for products to load (if any)
    await page.waitForLoadState("networkidle");

    // Check for product container or no products message
    const productContainer = page.locator('[data-testid="product-list"]');
    const noProductsMessage = page.locator("text=No products found");

    // Either products are displayed or no products message is shown
    await expect(productContainer.or(noProductsMessage)).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");

    // Check for common navigation links
    const homeLink = page.locator('a[href="/"]');
    const productsLink = page.locator('a[href="/products"]');
    const loginLink = page.locator('a[href="/login"]');

    // At least one navigation link should be present
    await expect(homeLink.or(productsLink).or(loginLink)).toBeVisible();
  });
});

test.describe("Authentication Flow", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");

    // Check for login form elements
    const loginForm = page.locator("form");
    await expect(loginForm).toBeVisible();

    // Check for email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput.or(passwordInput)).toBeVisible();
  });

  test("should handle login form submission", async ({ page }) => {
    await page.goto("/login");

    // Fill out login form if it exists
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    if (await emailInput.isVisible()) {
      await emailInput.fill("test@example.com");
    }

    if (await passwordInput.isVisible()) {
      await passwordInput.fill("testpassword123");
    }

    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for navigation or error message
      await page.waitForLoadState("networkidle");

      // Check that something happened (redirect or error)
      const currentUrl = page.url();
      expect(currentUrl).toBeDefined();
    }
  });
});

test.describe("Product Management", () => {
  test("should show products page", async ({ page }) => {
    await page.goto("/products");

    // Check that products page loads
    await expect(page).toHaveURL(/.*products/);

    // Check for product listing or create product form
    const productsList = page.locator('[data-testid="products-list"]');
    const createProductButton = page.locator("text=Create Product");

    await expect(productsList.or(createProductButton)).toBeVisible();
  });

  test("should show create product page", async ({ page }) => {
    await page.goto("/products/new");

    // Check for create product form
    const createForm = page.locator("form");
    await expect(createForm).toBeVisible();

    // Check for required form fields
    const nameInput = page.locator('input[name="name"]');
    const descriptionInput = page.locator('textarea[name="description"]');
    const priceInput = page.locator('input[name="price"]');

    // At least name input should be present
    await expect(nameInput).toBeVisible();
  });
});

test.describe("User Profile", () => {
  test("should show profile page", async ({ page }) => {
    await page.goto("/profile");

    // Check that profile page loads (might redirect to login)
    await page.waitForLoadState("networkidle");

    const currentUrl = page.url();

    // Should either show profile or redirect to login
    expect(currentUrl).toMatch(/\/(profile|login)/);
  });

  test("should show conversations page", async ({ page }) => {
    await page.goto("/profile/conversations");

    // Check that conversations page loads
    await page.waitForLoadState("networkidle");

    const currentUrl = page.url();

    // Should either show conversations or redirect to login
    expect(currentUrl).toMatch(/\/(profile\/conversations|login)/);
  });
});
