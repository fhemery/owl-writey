import { expect, test } from '@playwright/test';
import { getAuthToken } from '../tools/auth-helper';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

interface Exercise {
   id: string;
   type: string;
   name: string;
   config: {
       nbIterations: number;
       iterationDuration: number;
       minWords: number;
       maxWords: number;
       initialText: string;
   };
}

test.describe('API exercises', () => {
   let idToken: string;
   let sharedExerciseId: string;
   const EXERCISE_NAME = `API Test ${Date.now()}`;

    test.beforeAll(async ({ playwright }) => {
       const requestContext = await playwright.request.newContext();
       idToken = await getAuthToken(requestContext);
    });

    test.afterAll(async ({ request }) => {
       await request.delete(`${BASE_API_URL}/api/exercises`, {
           headers: { 'Authorization': `Bearer ${idToken}` }
       });
    });

    test.beforeEach(async ({ request }) => {
        const exerciseData = {
            "name": EXERCISE_NAME,
            "type": "ExquisiteCorpse",
            "config": {
               "nbIterations": 4,
               "iterationDuration": 300,
               "minWords": 3,
               "maxWords": 20,
               "initialText": "Initial setup text"
            }
        };

        const response = await request.post(`${BASE_API_URL}/api/exercises`, {
           headers: { 'Authorization': `Bearer ${idToken}` },
           data: exerciseData
        });
        expect(response.status()).toBe(201);

        const listResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
           headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const result = await listResponse.json();
        const exercisesList = result.exercises as Exercise[];
        const createdExercise = exercisesList.find(ex => ex.name === EXERCISE_NAME);
      
        if (!createdExercise) {
           throw new Error("The created exercise was not found in the list.");
        }

        sharedExerciseId = createdExercise.id;
    });

    test('should fetch the created exercise', async ({ request }) => {
        const response = await request.get(`${BASE_API_URL}/api/exercises/${sharedExerciseId}`, {
           headers: { 'Authorization': `Bearer ${idToken}` }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(sharedExerciseId);
    });

    test('should finish the exercise', async ({ request }) => {
        const finishResponse = await request.post(`${BASE_API_URL}/api/exercises/${sharedExerciseId}/finish`, {
           headers: { 'Authorization': `Bearer ${idToken}` }
        });
        expect(finishResponse.status()).toBe(204);
      
        const verify = await request.get(`${BASE_API_URL}/api/exercises/${sharedExerciseId}`, {
           headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const body = await verify.json();
        expect(body.status).toBe('Finished');
    });

    test('should delete the exercise', async ({ request }) => {
        const deleteResponse = await request.delete(`${BASE_API_URL}/api/exercises/${sharedExerciseId}`, {
           headers: { 'Authorization': `Bearer ${idToken}` }
        });
        expect(deleteResponse.status()).toBe(204);
    });
});
