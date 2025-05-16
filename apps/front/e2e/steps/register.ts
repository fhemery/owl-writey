import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I go to register page', async ({ registerPo }: AllFixtures) => {
    await registerPo.goTo();
});

Then('Register page should be displayed', async ({ registerPo }: AllFixtures) => {

    await registerPo.shouldBeDisplayed();
});

When('I click on the Connexion link', async ({ registerPo }: AllFixtures) => {
    await registerPo.redirectLog();
});
Then('Display the login page', async ({ loginPo }: AllFixtures) => {
    await loginPo.shouldBeDisplayed();
});

When('I fill the registration form with valid data', async ({ registerPo }: AllFixtures) => {
    await registerPo.registerAs('Edward', 'owl-37@hemit.fr', 'password', 'password');
});
Then('I am redirected to the dashboard page from the register page', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

When('I fill the registration form with wrong data', async ({ registerPo }: AllFixtures) => {
    await registerPo.wronglyRegisterAs('Ed', 'owl-30@hemit.fr', 'password', 'password');
});
Then('It should display an error on the register form', async ({ registerPo }: AllFixtures) => {
    await registerPo.shouldDisplayTranslatedText('register.form.name.error.minlength');
});
