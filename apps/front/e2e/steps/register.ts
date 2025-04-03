import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";
import { expect } from "@playwright/test";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I go to register page', async ({ registerPo }) => {
    await registerPo.goTo();
});

Then('Register page should be displayed', async ({ registerPo }) => {
    await registerPo.shouldBeDisplayed();
});

When('I click on the Connexion link', async ({ registerPo }) => {
    await registerPo.redirectLog();
});
Then('Display the login page', async ({ loginPo }) => {
    await loginPo.shouldBeDisplayed();
});

When('I fill the registration form with {string}', async ({ registerPo }, field: string) => {
    const testData: Record<string, [string, string, string, string] > = {
        ValidPseudo: ['Edward', 'owl-30@hemit.fr', 'password', 'password'],
        InvalidPseudo: ['Ed', 'owl-12@hemit.fr', 'password', 'password'],
        EmptyPseudo: ['', 'owl-36@hemit.fr', 'password', 'password'],

        ValidEmail: ['Edward', 'owl-31@hemit.fr', 'password', 'password'],
        InvalidEmail: ['Edward', 'invalid-email', 'password', 'password'],
        EmptyEmail: ['Edward', '', 'password', 'password'],

        ValidPassword: ['Edward', 'owl-32@hemit.fr', 'password', 'password'],
        InvalidPassword: ['Edward', 'owl-33@hemit.fr', 'short', 'short'],
        EmptyPassword: ['Edward', 'owl-37@hemit.fr', '', 'password'],

        ValidRepeatedPswd: ['Edward', 'owl-34@hemit.fr', 'password', 'password'],
        InvalidRepeatedPswd: ['Edward', 'owl-35@hemit.fr', 'password', 'mismatch'],
        EmptyRepeatedPswd: ['Edward', 'owl-38@hemit.fr', 'password', ''],

        ExistingAccount: ['Edward', 'owl-30@hemit.fr', 'password', 'password']
    };

    const [name, email, password, repeatedPassword] = testData[field];
    const isValid = field.startsWith('Valid');

    (global as any).lastUsedField = field;
    if (isValid) {
        await registerPo.registerAs(name, email, password, repeatedPassword);
    } else if (field === 'ExistingAccount') {
        await registerPo.registerAs(name, email, password, repeatedPassword, false);
    } else {
        await registerPo.wronglyRegisterAs(name, email, password, repeatedPassword);
    }
});
Then('{string} should be displayed for registration', async ({ registerPo, dashboardPo }, result: string) => {
    if (result === 'I am redirected to the dashboard page') {
        await dashboardPo.shouldBeDisplayed();
    } else if (result === 'It should display an error') {

        const lastInvalidField = (global as any).lastUsedField;
        switch (lastInvalidField) {
            case 'InvalidPseudo':
                await registerPo.shouldDisplayTranslatedText('register.form.name.error.minlength');
                break;
            case 'EmptyPseudo':
                await registerPo.shouldDisplayTranslatedText('register.form.name.error.required');
                break;

            case 'InvalidEmail':
                await registerPo.shouldDisplayTranslatedText('register.form.email.error.invalid');
                break;
            case 'EmptyEmail':
                await registerPo.shouldDisplayTranslatedText('register.form.email.error.required');
                break;

            case 'InvalidPassword':
                await registerPo.shouldDisplayTranslatedText('register.form.password.error.minlength');
                break;
            case 'EmptyPassword':
                await registerPo.shouldDisplayTranslatedText('register.form.password.error.required');
                break;

            case 'InvalidRepeatedPswd':
                await registerPo.shouldDisplayTranslatedText('register.form.error.passwordNotMatching');
                break;
            case 'EmptyRepeatedPswd':
                await registerPo.shouldDisplayTranslatedText('register.form.repeatPassword.error.required');
                break;

            case 'ExistingAccount':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;

            default:
                throw new Error(`Message d'erreur non défini pour le résultat: ${lastInvalidField}`);
        }
        if (lastInvalidField !== 'ExistingAccount') {
            await expect(registerPo.submitButton).toBeDisabled();
        }
    } 
});