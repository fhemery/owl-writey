import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am connected as a user', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewExercise();
});

Given('Display a new exercise form', async ({ exercisePo } : AllFixtures) => {
    await exercisePo.shouldDisplayForm();
});

When('I change the duration of the exercise to {string}', async ({exercisePo} : AllFixtures, value: string) => {
    await exercisePo.changeDuration(value);
});

Then('{string} should be the selected duration', async ({exercisePo} : AllFixtures, durationValue: string) => {
  await exercisePo.shouldDisplayDuration(durationValue)
});

When('I fill a new exercise form with valid data', async ({ exercisePo } : AllFixtures) => {
    await exercisePo.createdAs('Test d\'exercice owl-writey', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
});
Then('I am redirected to the current exercise', async ({ exercisePo } : AllFixtures) => {
    expect(exercisePo.getPage().url()).toContain('/exercises/');
    await expect(exercisePo.getPage().locator('.exercise-page')).toBeVisible();
    await exercisePo.shouldDisplayExercise('Test d\'exercice owl-writey');
});

When('I fill a new exercise form with wrong data', async ({ exercisePo } : AllFixtures) => {
    await exercisePo.wronglyCreatedAs('Yo', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
});
Then('It should display an error on the corresponding field', async ({ exercisePo } : AllFixtures) => {
    await exercisePo.shouldDisplayTranslatedText('exercise.form.name.error.minlength');
});

