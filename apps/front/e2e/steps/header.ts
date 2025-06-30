import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am on the Homepage', async ({ homePo }: AllFixtures) => {
    await homePo.goTo(); 
});

Given('The user is not connected', async ({ homePo }: AllFixtures) => {
    await homePo.shouldBeDisplayed();
});

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
});
When('I open the user menu', async ({ headerPo }: AllFixtures) => {
    await headerPo.openUserMenu();
});
When('I select {string} from the menu', async ({ headerPo }: AllFixtures, menuItemText: string) => {
    await headerPo.selectMenuItem(menuItemText as 'Dashboard' | 'Déconnexion');
});
Then('Display the home page from the header', async({ homePo }: AllFixtures) => {
    await homePo.shouldBeDisplayed();
});

When ('I click on the title header', async ({ headerPo }: AllFixtures) => {
    await headerPo.redirectTitle();
});
Then ('Display the dashboard page from the header', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});