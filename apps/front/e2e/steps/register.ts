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

// When('I fill the registration form', async ({ registerPo }) => {
//     await registerPo.registerAs(
//         'test13',
//         'owl-21@hemit.fr',
//         'password',
//         'password'
//       );
// });
// Then('I am redirected to the dashboard', async ({ dashboardPo }) => {
//     await dashboardPo.shouldBeDisplayed();
// });

// When('I complete the registration form', async ({ registerPo }) => {
//     await registerPo.wronglyRegisterAs(
//       'Ed',
//       'owl-12@hemit.fr',
//       'password',
//       'password'
//     );
// });
// Then('It should display error if pseudo field is wrong', async ({ registerPo }) => {
//     await registerPo.shouldDisplayTranslatedText(
//         'register.form.name.error.minlength'
//     );
// });

When('I fill the registration form with {string}', async ({ registerPo }, field: string) => {
    const testData: Record<string, [string, string, string, string] > = {
        ValidPseudo: ['Edward', 'owl-30@hemit.fr', 'password', 'password'],
        InvalidPseudo: ['Ed', 'owl-12@hemit.fr', 'password', 'password'],
        ValidEmail: ['Edward', 'owl-31@hemit.fr', 'password', 'password'],
        InvalidEmail: ['Edward', 'invalid-email', 'password', 'password'],
        ValidPassword: ['Edward', 'owl-32@hemit.fr', 'password', 'password'],
        InvalidPassword: ['Edward', 'owl-33@hemit.fr', 'short', 'short'],
        ValidRepeatedPswd: ['Edward', 'owl-34@hemit.fr', 'password', 'password'],
        InvalidRepeatedPswd: ['Edward', 'owl-35@hemit.fr', 'password', 'mismatch'],
    };

    const [name, email, password, repeatedPassword] = testData[field];

    // await registerPo.registerAs(name, email, password, repeatedPassword);

    const isValid = field.startsWith('Valid');

    if (isValid) {
        await registerPo.registerAs(name, email, password, repeatedPassword);
    } else {
        await registerPo.wronglyRegisterAs(name, email, password, repeatedPassword);
    }
});


Then('{string} should be displayed', async ({ registerPo, dashboardPo }, result: string) => {
    if (result === 'I am redirected to the dashboard page') {
        await dashboardPo.shouldBeDisplayed();
    } else {
        await registerPo.shouldDisplayTranslatedText('register.form.name.error.minlength');
        await expect(registerPo.submitButton).toBeDisabled();
    }
});