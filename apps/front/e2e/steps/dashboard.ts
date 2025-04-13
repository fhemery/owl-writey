import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am connected', async ({ loginPo }) => {
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

When('I click the Jouer button for exercise {string}', async ({ dashboardPo }, exerciseTitle) => {
    await dashboardPo.getExerciseByTitle(exerciseTitle).click();
});

Then('Display the current exercise clicked on', async ({ exercisePo }) => {
    await exercisePo.shouldBeDisplayed();
});
