import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('Given I am on the Homepage', async ({ homePo }) => {
    await homePo.goTo(); 
});

Given('The user is not connected', async () => {

});