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

When('I enter the registration with existing data', async ({ registerPo }: AllFixtures) => {
    await registerPo.registerAsWithoutRedirect('Teddy', 'bob@hemit.fr', 'password', 'password');
});
Then('It should display the error register.error', async ({ registerPo }: AllFixtures) => {
    await registerPo.shouldDisplayTranslatedText('register.error');
});

When('Password are mismatched while trying to register', async ({ registerPo }: AllFixtures) => {
    await registerPo.wronglyRegisterAs('Edward', 'owl-37@hemit.fr', 'password', 'password$');
});
Then('It should display the following error register.form.error.passwordNotMatching', async ({ registerPo }: AllFixtures) => {
    await registerPo.shouldDisplayTranslatedText('register.form.error.passwordNotMatching');
});
