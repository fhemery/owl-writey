import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";
import { expect } from "@playwright/test";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am on the Homepage', async ({ homePo }) => {
    await homePo.goTo(); 
});

Given('The user is not connected', async ({ headerPo }) => {
    await expect(headerPo.dashboardBtn).toBeHidden();
    await expect(headerPo.logoutBtn).toBeHidden();
    await expect(headerPo.loginBtn).toBeVisible();
    await expect(headerPo.registerBtn).toBeVisible();
});

When('I click on the Login button', async ({ headerPo }) => {
    await headerPo.redirectLogin();
});
Then('Display the login page from the header', async({ loginPo }) => {
    await loginPo.shouldBeDisplayed();
});

When('I click on the Register button', async ({ headerPo }) => {
    await headerPo.redirectRegister();
});
Then('Display the register page from the header', async({ registerPo }) => {
    await registerPo.shouldBeDisplayed();
});

Given('The user is connected', async ({ headerPo }) => {
    await expect(headerPo.loginBtn).toBeHidden();
    await expect(headerPo.registerBtn).toBeHidden();
    await expect(headerPo.dashboardBtn).toBeVisible();
    await expect(headerPo.logoutBtn).toBeVisible();
});

When('I click on the Dashboard button', async ({ headerPo }) => {
    await headerPo.redirectDashboard();
});
Then('Display the dashboard page from the header', async({ dashboardPo }) => {
    await dashboardPo.shouldBeDisplayed();
});

When('I click on the Logout button', async ({ headerPo }) => {
    await headerPo.redirectLogout();
});
Then('User is logged out', async({ headerPo }) => {
    await expect(headerPo.dashboardBtn).toBeHidden();
    await expect(headerPo.logoutBtn).toBeHidden();
    await expect(headerPo.loginBtn).toBeVisible();
    await expect(headerPo.registerBtn).toBeVisible();
});
Then('Display the home page from the header', async({ homePo }) => {
    await homePo.shouldBeDisplayed();
});
