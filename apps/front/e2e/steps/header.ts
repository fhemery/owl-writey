import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am on the Homepage', async ({ homePo }: AllFixtures) => {
    await homePo.goTo(); 
});

// Given('The user is not connected', async ({ headerPo }: AllFixtures) => {
//     await expect(headerPo.dashboardBtn).toBeHidden();
//     await expect(headerPo.logoutBtn).toBeHidden();
//     await expect(headerPo.loginBtn).toBeVisible();
//     await expect(headerPo.registerBtn).toBeVisible();
// });

When('I click on the Login button', async ({ headerPo }: AllFixtures) => {
    await headerPo.redirectLogin();
});
Then('Display the login page from the header', async({ loginPo }: AllFixtures) => {
    await loginPo.shouldBeDisplayed();
});

When('I click on the Register button', async ({ headerPo }: AllFixtures) => {
    await headerPo.redirectRegister();
});
Then('Display the register page from the header', async({ registerPo }: AllFixtures) => {
    await registerPo.shouldBeDisplayed();
});

Given('The user is connected', async ({ loginPo, dashboardPo }: AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
    // await expect(headerPo.dashboardBtn).toBeVisible();
    // await expect(headerPo.logoutBtn).toBeVisible();
    // await expect(headerPo.loginBtn).toBeHidden();
    // await expect(headerPo.registerBtn).toBeHidden();
});

When('I click on the Dashboard button', async ({ headerPo }: AllFixtures) => {
    await headerPo.redirectDashboard();
});
Then('Display the dashboard page from the header', async({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

When('I click on the Logout button', async ({ headerPo }: AllFixtures) => {
    await headerPo.redirectLogout();
});
// Then('User is logged out', async({ headerPo }: AllFixtures) => {
//     await expect(headerPo.dashboardBtn).toBeHidden();
//     await expect(headerPo.logoutBtn).toBeHidden();
//     await expect(headerPo.loginBtn).toBeVisible();
//     await expect(headerPo.registerBtn).toBeVisible();
// });
Then('Display the home page from the header', async({ homePo }: AllFixtures) => {
    await homePo.shouldBeDisplayed();
});