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

        LoginValidPassword: ['bob@hemit.fr', 'Test123!'],
        LoginInvalidPassword: ['bob@hemit.fr', 'short'],
    };

    const [email, password] = testData[field];
    const isValid = field.startsWith('Valid');
    (global as any).lastUsedField = field;

    if(isValid) {
        await loginPo.logAs(email, password);
    } else {
        await loginPo.wronglyLoggedAs(email, password);
    }
});
Then('{string} should be displayed for login', async ({ loginPo, dashboardPo }, result: string) => {
    if (result === 'I am redirected to the dashboard page') {
        await dashboardPo.shouldBeDisplayed();
    } else if (result === 'It should display an error') {
            await loginPo.shouldDisplayTranslatedText('auth.error');
    }
});