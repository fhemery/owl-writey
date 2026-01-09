import { expect, test } from '@playwright/test';

import { getAuthToken } from '../tools/auth-helper';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

interface Exercise {
    id: string;
    type: string;
    name?: string; // Le '?' signifie que c'est optionnel
    config: {
        // name?: string;
        nbIterations: number;
        initialText: string;
        // ajoute les autres champs si besoin
    };
}

test.describe('API exercises', () => {
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
            },
            data: exerciseData
        });

        expect(response.status()).toBe(201);

        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const result = await listResponse.json();

        const exercisesList = result.exercises as Exercise[];
        
        // On cherche l'exercice qu'on vient de créer dans la liste (par son nom)
        const createdBody = exercisesList.find(ex => ex.name === exerciseData.name);

        // 3. Tes vérifications fonctionnent maintenant sur 'createdBody' !
        expect(createdBody).toBeDefined();
        
        expect(createdBody?.name).toBe(exerciseData.name);
        expect(createdBody?.type).toBe(exerciseData.type);
    });

    test('should delete an exercise', async ({ request }) => {
        const exerciseData = {
            "name": "Unique API test name",
            "type": "ExquisiteCorpse",
            "config": {
                "nbIterations": 4,
                "iterationDuration": 300,
                "minWords": 3,
                "maxWords": 20,
                "initialText": "Initial API text test"
            }
        };

        // Create an exercise
        await request.post(`${BASE_API_URL}/api/exercises`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
            data: exerciseData
        });
        
        // Get an exercise
        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const result = await listResponse.json();
        
        const exercisesList = result.exercises as Exercise[]; 

        const exerciseToDelete = exercisesList.find(ex => ex.name === exerciseData.name);
        const exerciseId = exerciseToDelete?.id;

        // Delete an exercise
        const deleteResponse = await request.delete(`${BASE_API_URL}/api/exercises/${exerciseId}`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });

        expect(deleteResponse.status()).toBe(204);
        
        const verifyResponse = await request.get(`${BASE_API_URL}/api/exercises/${exerciseId}`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        expect(verifyResponse.status()).toBe(404);
    });

    test('should fetch a single exercise', async ({ request }) => {
        // Get all exercises
        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const listResult = await listResponse.json();
        const firstExercise = listResult.exercises[0];

        expect(firstExercise).toBeDefined();
        const exerciseId = firstExercise.id;

        // Get a single exercise
        const response = await request.get(`${BASE_API_URL}/api/exercises/${exerciseId}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json() as Exercise;
        
        expect(body.id).toBe(exerciseId);
        expect(body).toHaveProperty('config');
    });

    test('should finish exercise', async ({ request }) => {
        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const listResult = await listResponse.json();
        const exerciseId  = listResult.exercises[0].id;

        const finishResponse = await request.post(`${BASE_API_URL}/api/exercises/${exerciseId}/finish`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        })
        expect(finishResponse.status()).toBe(204);
        
       const verifyResponse = await request.get(`${BASE_API_URL}/api/exercises/${exerciseId}`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        
        const finishedExercise = await verifyResponse.json();
        expect(finishedExercise.status).toBe('Finished');
    });
});