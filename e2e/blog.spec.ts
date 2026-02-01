import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
    test("homepage loads correctly", async ({ page }) => {
        await page.goto("/");

        // Check that the header is visible
        await expect(page.locator("header")).toBeVisible();

        // Check that the hero section exists
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        // Check that blog posts are listed
        await expect(page.getByText("Últimos artículos")).toBeVisible();
    });

    test("can navigate to blog index", async ({ page }) => {
        await page.goto("/");
        await page.click('a[href="/blog"]');

        await expect(page).toHaveURL("/blog");
        await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    });

    test("can view a blog post", async ({ page }) => {
        await page.goto("/blog");

        // Click on the first post
        const firstPost = page.locator("article a").first();
        await firstPost.click();

        // Check breadcrumbs are visible
        await expect(page.locator("nav[aria-label='Breadcrumb']")).toBeVisible();

        // Check that the article content is visible
        await expect(page.locator("article")).toBeVisible();

        // Check post navigation is visible (if there are multiple posts)
        const postNav = page.locator("nav[aria-label='Navegación entre artículos']");
        // This may or may not be visible depending on number of posts
    });

    test("dark mode toggle works", async ({ page }) => {
        await page.goto("/");

        // Find and click the theme toggle button
        const themeToggle = page.locator("button").filter({ has: page.locator("svg") }).first();

        // Get initial theme
        const htmlElement = page.locator("html");
        const initialClass = await htmlElement.getAttribute("class");

        // Click the toggle
        await themeToggle.click();

        // Verify class changed
        const newClass = await htmlElement.getAttribute("class");
        expect(newClass).not.toBe(initialClass);
    });
});
