import { expect, test } from '@playwright/test';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

test.describe('API log', () => {
    // let idToken: string;

    // test.beforeAll(async ({ playwright }) => {
    //     const requestContext = await playwright.request.newContext();
    //     idToken = await getAuthToken(requestContext);
    // });

    test('should create a log', async ({ request }) => {
        const logData = {
            "name": "Edward",
            "email": "owl-25@hemit.fr",
            "password": "password",
            "repeatPassword": "password"
        };

        const logResponse = await request.post(`${BASE_API_URL}/api/log`, {
            headers: {
                // 'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            },
            data: logData
        });

        // eslint-disable-next-line playwright/no-conditional-in-test
        if (logResponse.status() !== 204) {
            console.log("Détails de l'erreur :", await logResponse.json());
        }
        expect(logResponse.status()).toBe(204);
    });

    // test('should create a log', async ({ request }) => {
    //     const logData = {
    //         "name": "Edward",
    //         "email": "owl-25@hemit.fr",
    //         "password": "password",
    //         "repeatPassword": "password"
    //     };

    //     // Notez l'utilisation de 127.0.0.1 au lieu de localhost
    //     const response = await request.post(`http://127.0.0.1:3000/api/log`, {
    //         data: logData
    //     });

    //     // Si on arrive ici, c'est que la connexion a réussi !
    //     // On affiche la réponse pour connaître la constitution attendue
    //     console.log("--- RÉPONSE DU SERVEUR ---");
    //     console.log("Status:", response.status());
    //     try {
    //         console.log("Body:", await response.json());
    //     } catch (e) {
    //         console.log("Le serveur n'a pas renvoyé de JSON.");
    //     }

    //     expect(response.status()).toBe(204);
    // });
});