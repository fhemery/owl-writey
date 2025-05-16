import { createBdd } from 'playwright-bdd';

import { AllFixtures, pageFixtures } from '../support/fixtures';

export const fixtures = pageFixtures;
const { When, Then } = createBdd(fixtures);

When('I go to home page', async ({ homePo }: AllFixtures) => {
  await homePo.goTo();
});

Then('Home page should be displayed', async ({ homePo }: AllFixtures) => {
  await homePo.shouldBeDisplayed();
});
