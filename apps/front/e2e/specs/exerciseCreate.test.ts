import { expect, test } from '@playwright/test';
import { getAuthToken } from '../tools/auth-helper';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

test.describe('Exercices Created API', () => {
    let idToken: string;

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext();
        idToken = await getAuthToken(requestContext);
    });

    test('should create an exercise', async ({ request }) => {
        const exerciseData = {
            "name": "API test",
            "type": "ExquisiteCorpse",
            "config": {
                "nbIterations": 4,
                "iterationDuration": 300,
                "minWords": 3,
                "maxWords": 20,
                "initialText": "Initial API text test"
            }
        };

        const response = await request.post(`${BASE_API_URL}/api/exercises`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                // 'Accept': 'application/json'
            },
            data: exerciseData
        });

        expect(response.status()).toBe(201);


        const contentType = response.headers()['content-type'];

        if (contentType && contentType.includes('application/json')) {
            const body = await response.json();
            console.log("Objet créé :", body);
            expect(body).toHaveProperty('id');
        } else {
            const rawBody = await response.text();
            console.log("Le serveur n'a pas renvoyé de JSON. Corps reçu :", rawBody);
        }

        // const body = await response.json();

        // expect(body).toHaveProperty('id');
        // expect(body.type).toBe(exerciseData.type);
        // expect(body.config.initialText).toBe(exerciseData.config.initialText);

    });

});