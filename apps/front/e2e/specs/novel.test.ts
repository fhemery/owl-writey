import { expect, test } from '@playwright/test';
import { getAuthToken } from '../tools/auth-helper';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

interface Novel {
    id: string;
    title: string;
    description?: string;
}

test.describe('API novel', () => {
    let idToken: string;

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext();
        idToken = await getAuthToken(requestContext);
    });

    test('should create a novel', async ({ request }) => {
        const novelData = {
            "title": "API test title",
            "description": "Api test description"
        };

        const novelResponse = await request.post(`${BASE_API_URL}/api/novels`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                // 'Accept': 'application/json'
            },
            data: novelData
        });

        expect(novelResponse.status()).toBe(201);

        const listResponse = await request.get(`${BASE_API_URL}/api/novels`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                // 'Accept': 'application/json'
            }
        });
        const result = await listResponse.json();
        // console.log("Structure réelle de l'exercice reçu :", JSON.stringify(result, null, 2));

        const novelList = result.data as Novel[];

        const createdBody = novelList.find(n => n.title === novelData.title);

        expect(createdBody).toBeDefined();
        if(createdBody) {
            // console.log("Structure réelle de l'exercice reçu :", JSON.stringify(createdBody, null, 2));
            expect(createdBody.title).toBe(novelData.title);
            expect(createdBody.description).toBe(novelData.description);
        }
    });
});