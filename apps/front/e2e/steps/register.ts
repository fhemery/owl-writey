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
        ValidPseudo: ['Edward', 'owl-37@hemit.fr', 'password', 'password'],
        InvalidPseudo: ['Ed', 'owl-30@hemit.fr', 'password', 'password'],
        EmptyPseudo: ['', 'owl-30@hemit.fr', 'password', 'password'],
        AttackSQLPseudo: ["Robert'); DROP TABLE users;—", 'owl-38@hemit.fr', 'password', 'password'],
        Attack2SQLPseudo: ['test@example.com\' OR \'1\'=\'1', 'owl-33@hemit.fr', 'password', 'password'],
        AttackXSSPseudo: ["<script>alert('XSS')</script>", 'owl-34@hemit.fr', 'password', 'password'],

        // ValidEmail: ['Edward', 'owl-30@hemit.fr', 'password', 'password'],
        InvalidEmail: ['Edward', 'invalid-email', 'password', 'password'],
        EmptyEmail: ['Edward', '', 'password', 'password'],
        AttackSQLEmail: ['Edward', "test2' OR '1'='1@example.com", 'password', 'password'],
        AttackXSSEmail: ['Edward', "<script>alert('XSS')</script>", 'password', 'password'],

        // ValidPassword: ['Edward', 'owl-30@hemit.fr', 'password', 'password'],
        InvalidPassword: ['Edward', 'owl-30@hemit.fr', 'short', 'short'],
        EmptyPassword: ['Edward', 'owl-30@hemit.fr', '', 'password'],
        AttackSQLPswd: ['Edward', 'owl-35@hemit.fr', 'test@example.com\' OR \'1\'=\'1', 'test@example.com\' OR \'1\'=\'1'],
        AttackXSSPswd: ['Edward', 'owl-36@hemit.fr', "<script>alert('XSS')</script>", "<script>alert('XSS')</script>"],

        // ValidRepeatedPswd: ['Edward', 'owl-30@hemit.fr', 'password', 'password'],
        InvalidRepeatedPswd: ['Edward', 'owl-30@hemit.fr', 'password', 'mismatch'],
        EmptyRepeatedPswd: ['Edward', 'owl-30@hemit.fr', 'password', ''],

        ExistingAccount: ['Edward', 'owl-30@hemit.fr', 'password', 'password']
    };

    const [name, email, password, repeatedPassword] = testData[field];
    const isValid = field.startsWith('Valid');
    const isAttacked = field.startsWith('Attack');

    (global as any).lastUsedField = field;
    if (isValid) {
        await registerPo.registerAs(name, email, password, repeatedPassword);
    } else if (field === 'ExistingAccount') {
        await registerPo.registerAs(name, email, password, repeatedPassword, false);
    } else if (isAttacked) { 
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
            case 'AttackSQLPseudo':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;
            case 'Attack2SQLPseudo':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;
            case 'AttackXSSPseudo':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;

            case 'InvalidEmail':
                await registerPo.shouldDisplayTranslatedText('register.form.email.error.invalid');
                break;
            case 'EmptyEmail':
                await registerPo.shouldDisplayTranslatedText('register.form.email.error.required');
                break;
            case 'AttackSQLEmail':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;
            case 'AttackXSSEmail':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;

            case 'InvalidPassword':
                await registerPo.shouldDisplayTranslatedText('register.form.password.error.minlength');
                break;
            case 'EmptyPassword':
                await registerPo.shouldDisplayTranslatedText('register.form.password.error.required');
                break;
            case 'AttackSQLPswd':
                await registerPo.shouldDisplayTranslatedText('register.error');
                break;
            case 'AttackXSSPswd':
                await registerPo.shouldDisplayTranslatedText('register.error');
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