import { test, expect } from '@playwright/test';

test('homepage loads and shows a key call to action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /welcome to global tourism platform/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /start exploring/i })).toBeVisible();
});
