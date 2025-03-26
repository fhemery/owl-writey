import { createBdd } from 'playwright-bdd';

import { pageFixtures } from '../support/fixtures';

export const fixtures = pageFixtures;
const { When, Then } = createBdd(fixtures);

When('I go to home page', async ({ homePo }) => {
  await homePo.goTo();
});

Then('Home page should be displayed', async ({ homePo }) => {
  await homePo.shouldBeDisplayed();
});
