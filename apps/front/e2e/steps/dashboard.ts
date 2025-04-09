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

When('I click to Create a new exercise', async ({ dashboardPo }) => {
    await dashboardPo.createNewExercise();
});

Then('Display the new exercise form', async ({ exercisePo }) => {
    await exercisePo.shouldDisplayForm();
});

When('I click to exercises done toggle', async ({ dashboardPo }) => {
    await dashboardPo.displayEndedExercises();
});

Then('Display exercises done on the dashboard', async ({ dashboardPo}) => {
    await dashboardPo.checkFinishedExercisesIncluded();
});

When('I click to playAlt button', async ({ dashboardPo }) => {
    await dashboardPo.displayCurrentExercise();
});
Then('Display the current exercise clicked on', async ({ exercisePo }) => {
    await exercisePo.shouldBeDisplayed();
});
