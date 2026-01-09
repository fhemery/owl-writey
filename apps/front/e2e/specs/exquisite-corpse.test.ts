import { expect, test } from '@playwright/test';

import { getAuthToken } from '../tools/auth-helper';
const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

test.describe('API exercises', () => {
    let idToken: string;

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext();
        idToken = await getAuthToken(requestContext);
    });

    test('should take part to an exercise', async ({ request }) => {
        const exerciseData = {
            "name": "Take-turnAPI test name",
            "type": "ExquisiteCorpse",
            "config": {
                "nbIterations": 4,
                "iterationDuration": 300,
                "minWords": 3,
                "maxWords": 20,
                "initialText": "Initial API text test"
            }
        };

        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });

        const listResult = await listResponse.json();
        const exerciseId  = listResult.exercises[0].id;

        const takeTurnResponse = await request.post(`${BASE_API_URL}/api/exquisite-corpse/${exerciseId}/take-turn`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            },
            data: exerciseData
        });
        expect(takeTurnResponse.status()).toBe(204);
    });

    test('should cancel turn during an exercise', async ({ request }) => {
        const exerciseData = {
            "name": "Cancel turn API test name",
            "type": "ExquisiteCorpse",
            "config": {
                "nbIterations": 4,
                "iterationDuration": 300,
                "minWords": 3,
                "maxWords": 20,
                "initialText": "Initial API text test"
            }
        };

        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });

        const listResult = await listResponse.json();
        const exerciseId  = listResult.exercises[0].id;


        await request.post(`${BASE_API_URL}/api/exquisite-corpse/${exerciseId}/take-turn`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        const cancelTurnResponse = await request.post(`${BASE_API_URL}/api/exquisite-corpse/${exerciseId}/cancel-turn`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            },
            data: exerciseData
        });
        expect(cancelTurnResponse.status()).toBe(204);
    });

    test('should submit turn during an exercise', async ({ request }) => {
        const exerciseData = {
            "name": "Submit turn API test name",
            "type": "ExquisiteCorpse",
            "config": {
                "nbIterations": 4,
                "iterationDuration": 300,
                "minWords": 3,
                "maxWords": 20,
                "initialText": "Initial API text test"
            }
        };

        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });

        const listResult = await listResponse.json();
        const exerciseId  = listResult.exercises[0].id;


        await request.post(`${BASE_API_URL}/api/exquisite-corpse/${exerciseId}/take-turn`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        
        const cancelTurnResponse = await request.post(`${BASE_API_URL}/api/exquisite-corpse/${exerciseId}/submit-turn`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            },
            data: exerciseData
        });
        expect(cancelTurnResponse.status()).toBe(204);
    });
});