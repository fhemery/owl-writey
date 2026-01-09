import { expect, test } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();
const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';
//const API_KEY = process.env['OWL_FIREBASE_API_KEY'];

test.describe('Dashboard API with Firebase Auth', () => {
    let idToken: string;

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext();
        idToken = await getAuthToken(requestContext);
    });

    test('should authenticate via Google and fetch exercises and novels', async ({ request }) => {
    
        // 2. Utiliser ce token pour appeler VOTRE backend
        const exercisesResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });

        const novelsResponse = await request.get(`${BASE_API_URL}/api/novels`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });

        // 3. Assertions finales
        expect(exercisesResponse.ok()).toBeTruthy();
        expect(exercisesResponse.status()).toBe(200);
        const result = await exercisesResponse.json();

        const exercisesList = result.exercises;
        expect(Array.isArray(exercisesList)).toBe(true);
        expect(exercisesList.length).toBeGreaterThanOrEqual(0);
        
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (exercisesList.length > 0) {
        console.log(`Premier exercice trouvé : ${exercisesList[0].name}`);
        // eslint-disable-next-line playwright/no-conditional-expect
        expect(exercisesList[0]).toHaveProperty('id');
        // eslint-disable-next-line playwright/no-conditional-expect
        expect(exercisesList[0]).toHaveProperty('name');
        }


        expect(novelsResponse.ok()).toBeTruthy();
        expect(novelsResponse.status()).toBe(200);
        const novelsResult = await novelsResponse.json();
        
        // console.log('--- Structure reçue pour novels ---');
        // console.log(JSON.stringify(novelsResult, null, 2));

        const novelsList = novelsResult.data;
        expect(Array.isArray(novelsList)).toBe(true);
        expect(novelsList.length).toBeGreaterThanOrEqual(0);
        
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (novelsList.length > 0) {
        console.log(`Premier roman rencontré : ${novelsList[0].title}`);
        // eslint-disable-next-line playwright/no-conditional-expect
        expect(novelsList[0]).toHaveProperty('id');
        // eslint-disable-next-line playwright/no-conditional-expect
        expect(novelsList[0]).toHaveProperty('title');
        }

        console.log(`Result : ${exercisesList.length} exercises found.`);
        console.log(`Result : ${novelsList.length} novels found.`);
    });
});