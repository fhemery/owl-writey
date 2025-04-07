import { createBdd } from "playwright-bdd";
import { pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I go to login page', async ({ loginPo }) => {
    await loginPo.goTo();
});

Then('Login page should be displayed', async ({ loginPo }) => {
    await loginPo.shouldBeDisplayed();
});

When('I click on the Register link', async ({ loginPo }) => {
    await loginPo.redirectRegister();
});
Then('Display registration page', async({ registerPo }) => {
    await registerPo.shouldBeDisplayed();
});


When('I fill the login form with {string}', async ({ loginPo }, field: string) => {
    const testData: Record<string, [string, string] > = {
        LoginValidEmail: ['bob@hemit.fr', 'Test123!'],
        LoginInvalidEmail: ['invalid-email', 'password'],
        LoginEmptyEmail: ['', 'password'],

        LoginValidPassword: ['bob@hemit.fr', 'Test123!'],
        LoginInvalidPassword: ['bob@hemit.fr', 'short'],
        LoginEmptyPassword: ['bob@hemit.fr', '']
    };

    const [login, password] = testData[field];
    const isValid = field.startsWith('LoginValid');
    (global as any).lastUsedField = field;

    if(isValid) {
        await loginPo.logAs(login, password);
    } else if (field === 'LoginInvalidPassword') { 
        await loginPo.logAs(login, password);
    }else {
        await loginPo.wronglyLoggedAs(login, password);
    }
});
Then('{string} should be displayed for login', async ({ loginPo, dashboardPo }, result: string) => {
    if (result === 'I am redirected to the dashboard page') {
        await dashboardPo.shouldBeDisplayed();
    } else if (result === 'It should display an error') {

        const lastInvalidField = (global as any).lastUsedField;
        switch (lastInvalidField) {
            case 'LoginInvalidEmail':
                await loginPo.shouldDisplayTranslatedText('auth.form.email.error.email');
                break;
            case 'LoginEmptyEmail':
                await loginPo.shouldDisplayTranslatedText('auth.form.email.error.required');
                break;
            
            case 'LoginInvalidPassword':
                await loginPo.shouldDisplayTranslatedText('auth.error');
                break;
            case 'LoginEmptyPassword':
                await loginPo.shouldDisplayTranslatedText('auth.form.password.error.required');
                break;
            
            default:
            throw new Error(`Message d'erreur non défini pour le résultat: ${lastInvalidField}`);
        }
    }
});