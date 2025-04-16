import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am connected as a user', async ({ loginPo, dashboardPo }) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
    await dashboardPo.createNewExercise();
});

Given('Display a new exercise form', async ({ exercisePo }) => {
    await exercisePo.shouldDisplayForm();
});

When('I fill a new exercise form with {string}', async ({ exercisePo}, field: string) => {
    const testData: Record<string, [string, string, string, string, string, string] > = {
        ValidName: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],
        InvalidName: ['Yo', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],
        EmptydName: ['', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],

        ValidNbIterations: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],
        InvalidNbIterations: ['Ceci est un test', '0', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],

        ValidIterationDuration: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],

        ValidMinWords: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],
        InvalidMinWords: ['Ceci est un test', '3', '5 minutes', '0', '3', 'Ceci est un test de début d\'histoire.'],

        ValidMaxWords: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],
        InvalidMaxWords: ['Ceci est un test', '3', '5 minutes', '3', '0', 'Ceci est un test de début d\'histoire.'],
        MinMaxWordsComparison: ['Ceci est un test', '3', '5 minutes', '3', '2', 'Ceci est un test de début d\'histoire.'],

        ValidInitialText: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Ceci est un test de début d\'histoire.'],
        InvalidInitialText: ['Ceci est un test', '3', '5 minutes', '3', '3', 'Test'],
        EmptyInitialText: ['Ceci est un test', '3', '5 minutes', '3', '3', '']
    };

    const [name, nbIterations, iterationDuration, minWords, maxWords, initialText] = testData[field];
    const isValid = field.startsWith('Valid');

    if (isValid) {
        await exercisePo.createdAs(name, nbIterations, iterationDuration, minWords, maxWords, initialText);
    } else {
        await exercisePo.wronglyCreatedAs(name, nbIterations, iterationDuration, minWords, maxWords, initialText);
    }
});

Then('{string} should be displayed for exercise', async ({ exercisePo }, result: string) => {
    if (result === 'I am redirected to the dashboard page') {
        await exercisePo.shouldBeDisplayed();
    } else if (result === 'It should display an error') {

        const lastInvalidField = (global as any).lastUsedField;
        switch (lastInvalidField) {
            case 'InvalidName':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.name.error.minlength');
                break;
            case 'EmptyName':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.name.error.required');
                break;
            
            case 'InvalidNbIterations':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.nbIterations.error.min');
                break;

            case 'InvalidMinWords':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.words.minWords.error.min');
                break;

            case 'InvalidMaxWords':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.words.maxWords.error.min');
                break;
            case 'MinMaxWordsComparison':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.words.error.shouldHaveMaxWordsGreaterThanMinWords');
                break;

            case 'InvalidInitialText':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.initialText.error.minlength');
                break;
            case 'EmptyInitialText':
                await exercisePo.shouldDisplayTranslatedText('exercise.form.exquisiteCorpse.initialText.error.required');
                break;

            default:
                throw new Error(`Message d'erreur non défini pour le résultat: ${lastInvalidField}`);
        }
    }
});