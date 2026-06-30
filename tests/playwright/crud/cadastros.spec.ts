import { test, expect } from "@playwright/test";
import { loginAsSuperAdmin } from "../helpers/setup";

test.describe("Cadastros CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSuperAdmin(page);
  });

  test("pagina de clientes carrega", async ({ page }) => {
    await page.goto("/clientes");
    await expect(page.locator("text=Clientes").first()).toBeVisible();
  });

  test("pagina de clientes retorna 200", async ({ page }) => {
    const response = await page.goto("/clientes");
    expect(response?.status()).toBe(200);
  });
});
