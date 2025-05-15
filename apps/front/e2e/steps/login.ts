import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";
import { LoginPo } from "../pages/login.po";
import { RegisterPo } from "../pages/register.po";
import { DashboardPo } from "../pages/dashboard.po";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I go to login page', async ({ loginPo }) => {
    await loginPo.goTo();
});

Then('Login page should be displayed', async ({ page, loginPo, registerPo, dashboardPo }) => {
    loginPo = new LoginPo(page);
    registerPo = new RegisterPo(page);
    dashboardPo = new DashboardPo(page);

    await loginPo.shouldBeDisplayed();
});

When('I click on the Register link', async ({ loginPo }) => {
    await loginPo.redirectRegister();
});
Then('Display registration page', async({ registerPo }) => {
    await registerPo.shouldBeDisplayed();
});

When('I fill the login form with valid data', async ({ loginPo }) => {
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
});
Then('I am redirected to the dashboard page from the login page', async ({ dashboardPo }) => {
     await dashboardPo.shouldBeDisplayed();
});

When('I fill the login form with wrong data', async ({ loginPo }) => {
    await loginPo.wronglyLoggedAs('invalid-email', 'password');
});
Then('It should display an error on the login form', async ({ loginPo }) => {
    await loginPo.shouldDisplayTranslatedText('auth.form.email.error.email');
});
