import * as dotenv from 'dotenv';
import { expect, test } from '@playwright/test';

dotenv.config();
const API_URL = `${process.env['PLAYWRIGHT_BASE_URL']}/api/exercises`;
const API_KEY = process.env['OWL_FIREBASE_API_KEY'];

test.describe('Dashboard page', () => {
    
    test('should be displayed and display exercises', async ({ request }) => {
    
        const loginResponse = await request.post(`${process.env['PLAYWRIGHT_BASE_URL']}/api/login`, {
            data: {
                email: 'bob@hemit.fr',
                password: 'Test123!'
            }
        });

        const loginBody = await loginResponse.json();
        const token = loginBody.token;

        const exercisesResponse  = await request.get(API_URL, {
            headers: {
            // Remplacez par votre vrai token ou une variable d'env
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        // expect(exercisesResponse.ok()).toBeTruthy();
        expect(exercisesResponse.status()).toBe(200);

        const exercisesBody = await exercisesResponse.json();
        
        expect(Array.isArray(exercisesBody)).toBe(true); 
        expect(exercisesBody.length).toBeGreaterThanOrEqual(0);

        console.log(`API vérifiée. ${exercisesBody.length} exercices trouvés.`);
    });
});

