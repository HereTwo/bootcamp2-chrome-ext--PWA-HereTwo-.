// @ts-check
const { test, expect } = require('@playwright/test');
const BASE = process.env.E2E_BASE_URL || 'http://localhost:8080';

test('PWA carrega e salva nota localmente', async ({ page }) => {
  await page.goto(BASE);
  await expect(page).toHaveTitle(/Note Saver PWA/);
  await page.fill('#note','Teste E2E ' + Date.now());
  await page.click('#saveNote');
  await page.waitForSelector('.note-item');
  const items = await page.$$eval('.note-item', els => els.length);
  expect(items).toBeGreaterThan(0);
});