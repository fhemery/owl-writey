import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I go to login page', async ({ loginPo }: AllFixtures) => {
    await loginPo.goTo();
});

Then('Login page should be displayed', async ({ loginPo }: AllFixtures) => {
    await loginPo.shouldBeDisplayed();
});

When('I click on the Register link', async ({ loginPo }: AllFixtures) => {
    await loginPo.redirectRegister();
});
Then('Display registration page', async({ registerPo }: AllFixtures) => {
    await registerPo.shouldBeDisplayed();
});

When('I fill the login form with valid data', async ({ loginPo }: AllFixtures) => {
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
});
Then('I am redirected to the dashboard page from the login page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

When('I fill the login form with wrong data', async ({ loginPo }: AllFixtures) => {
    await loginPo.wronglyLoggedAs('invalid-email', 'password');
});
Then('It should display an error on the login form', async ({ loginPo }: AllFixtures) => {
    await loginPo.shouldDisplayTranslatedText('auth.form.email.error.email');
});
