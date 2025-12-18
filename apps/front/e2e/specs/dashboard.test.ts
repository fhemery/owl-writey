// import * as dotenv from 'dotenv';
// import { expect, test } from '@playwright/test';

// dotenv.config();

// const API_URL = `${process.env['PLAYWRIGHT_BASE_URL']}/api/exercises`;
// const API_KEY = process.env['OWL_FIREBASE_API_KEY'];

// test.describe('Dashboard page', () => {
    
//     test('should be displayed and display exercises', async ({ request }) => {
    
//         const loginResponse = await request.post(`${process.env['PLAYWRIGHT_BASE_URL']}/api/login`, {
//             data: {
//                 email: 'bob@hemit.fr',
//                 password: 'Test123!'
//             }
//         });
//         const loginBody = await loginResponse.json();
//         const token = loginBody.token;

//         const exercisesResponse  = await request.get(API_URL, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Accept': 'application/json'
//             }
//         });
//         expect(exercisesResponse.status()).toBe(200);
//         const exercisesBody = await exercisesResponse.json();
//         expect(Array.isArray(exercisesBody)).toBe(true); 
//         expect(exercisesBody.length).toBeGreaterThanOrEqual(0);
//         console.log(`API checked. ${exercisesBody.length} exercises found.`);
//     });
// });

import { expect, test } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const FIREBASE_API_KEY = process.env['OWL_FIREBASE_API_KEY'];
const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

test.describe('Dashboard API with Firebase Auth', () => {

    test('should authenticate via Google and fetch exercises', async ({ request }) => {
        
        // 1. Demander un token à Firebase (Google Identity Toolkit)
        const firebaseResponse = await request.post(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_API_KEY}`,
            {
                data: {
                    email: 'bob@hemit.fr',
                    password: 'Test123!',
                    returnSecureToken: true
                }
            }
        );

        expect(firebaseResponse.ok(), "Authentification Firebase échouée").toBeTruthy();
        const authData = await firebaseResponse.json();
        const idToken = authData.idToken; // C'est votre précieux sésame

        console.log('--- Auth Success ---');
        console.log('User ID:', authData.localId);

        // 2. Utiliser ce token pour appeler VOTRE backend
        const exercisesResponse = await request.get(`${BASE_API_URL}/api/exercises`, {
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
        
        if (exercisesList.length > 0) {
        console.log(`Premier exercice trouvé : ${exercisesList[0].name}`);
        expect(exercisesList[0]).toHaveProperty('id');
        expect(exercisesList[0]).toHaveProperty('name');
        }

        console.log(`Result : ${exercisesList.length} exercises found.`);
    });
});