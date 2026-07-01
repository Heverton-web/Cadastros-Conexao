const SUPER_ADMIN = {
  email: "hevertoneduardoperes@gmail.com",
  password: "@#Khen741963@#",
};

async function loginAsSuperAdmin(page) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  await page.goto(appUrl + "/", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', SUPER_ADMIN.email);
  await page.fill('input[type="password"]', SUPER_ADMIN.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForTimeout(2000);
}

module.exports = { loginAsSuperAdmin, SUPER_ADMIN };
