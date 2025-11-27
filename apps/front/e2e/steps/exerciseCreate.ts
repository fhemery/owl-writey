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

Given('Display a new exercise form', async ({ exerciseCreatePo } : AllFixtures) => {
    await exerciseCreatePo.shouldDisplayForm();
});

When('I change the duration of the exercise to {string}', async ({exerciseCreatePo} : AllFixtures, value: string) => {
    await exerciseCreatePo.changeDuration(value);
});

Then('{string} should be the selected duration', async ({exerciseCreatePo} : AllFixtures, durationValue: string) => {
  await exerciseCreatePo.shouldDisplayDuration(durationValue);
});

When('I fill a new exercise form with valid data', async ({ page, exerciseCreatePo } : AllFixtures) => {
    const apiResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/exercises') && 
        response.request().method() === 'POST' && 
        response.status() === 201
    );

    await exerciseCreatePo.createdAs('Test d\'exercice owl-writey', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');

    const response = await apiResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('I am redirected to the current exercise', async ({ exerciseCurrentPo } : AllFixtures) => {
    await exerciseCurrentPo.shouldBeDisplayed();
});

// When('I fill a new exercise form with wrong data', async ({ exerciseCreatePo } : AllFixtures) => {
//     await exerciseCreatePo.wronglyCreatedAs('Yo', '4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
// });
// Then('It should display an error on the corresponding field', async ({ exerciseCreatePo } : AllFixtures) => {
//     await exerciseCreatePo.shouldDisplayTranslatedText('exercise.form.name.error.minlength');
// });

// When('I add a negative figure to the iteration nb', async ({ exerciseCreatePo }: AllFixtures) => {
//     await exerciseCreatePo.wronglyCreatedAs(
//         'Hello my dear', '-4', '5 minutes', '4', '5', 'Ceci est un test pour valider ou non le bon fonctionnement du formulaire');
// });
// Then('It should display the following error exercise.form.exquisiteCorpse.nbIterations.error.min', async ({ exerciseCreatePo }: AllFixtures) => {
//     await exerciseCreatePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.nbIterations.error.min');
// });

// When('I do not add content in the initialText field', async ({ exerciseCreatePo }: AllFixtures) => {
//     await exerciseCreatePo.wronglyCreatedAs(
//         'Hello my dear', '4', '5 minutes', '4', '5', '');
// });
// Then('It should display the following error exercise.form.exquisiteCorpse.initialText.error.required', async ({ exerciseCreatePo }: AllFixtures) => {
//     await exerciseCreatePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.initialText.error.required');
// });