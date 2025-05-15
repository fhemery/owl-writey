import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";
import { RegisterPo } from "../pages/register.po";
import { DashboardPo } from "../pages/dashboard.po";
import { LoginPo } from "../pages/login.po";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I go to register page', async ({ page, registerPo, dashboardPo }) => {
    await registerPo.goTo();
});

Then('Register page should be displayed', async ({ page, registerPo, dashboardPo, loginPo }) => {
    registerPo = new RegisterPo(page);
    dashboardPo = new DashboardPo(page);
    loginPo = new LoginPo(page);

    await registerPo.shouldBeDisplayed();
});

When('I click on the Connexion link', async ({ registerPo }) => {
    await registerPo.redirectLog();
});
Then('Display the login page', async ({ loginPo }) => {
    await loginPo.shouldBeDisplayed();
});

When('I fill the registration form with valid data', async ({ registerPo }) => {
    await registerPo.registerAs('Edward', 'owl-37@hemit.fr', 'password', 'password');
});
Then('I am redirected to the dashboard page from the register page', async ({ dashboardPo }) => {
    await dashboardPo.shouldBeDisplayed();
});

When('I fill the registration form with wrong data', async ({ registerPo }) => {
    await registerPo.wronglyRegisterAs('Ed', 'owl-30@hemit.fr', 'password', 'password');
});
Then('It should display an error on the register form', async ({ registerPo }) => {
    await registerPo.shouldDisplayTranslatedText('register.form.name.error.minlength');
});
