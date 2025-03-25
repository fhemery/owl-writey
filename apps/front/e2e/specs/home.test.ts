import { expect, test } from '@playwright/test';

import { TestTranslator } from '../tools/test-translator';

test.describe('Home page', () => {
  const translator = new TestTranslator();
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    expect(await page.locator('h1').innerText()).toContain(
      translator.get('home.title')
    );
  });

  test('has a link to the login page', async ({ page }) => {
    expect(
      await page.getByRole('button', { name: 'Rejoignez-nous !' }).count()
    ).toBe(1);
  });

});
