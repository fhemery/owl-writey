import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am connected', async ({ loginPo, dashboardPo }) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
});

Given('Dashboard page should be displayed', async ({ dashboardPo }) => {
    console.log('✅ Dashboard is displayed');
    await dashboardPo.shouldBeDisplayed();
});

// Given('I go to dashboard page', async ({ dashboardPo }) => {
//     console.log('📦 Navigating to dashboard');
//     await dashboardPo.goTo();
//     console.log('📍 Arrived on dashboard page');
// });


When('I click to Create a new exercise', async ({ dashboardPo }) => {
    await dashboardPo.createNewExercise();
});

Then('Display the new exercise form', async ({ exercisePo }) => {
    await exercisePo.shouldDisplayForm();
})