import { expect, test } from '@playwright/test';
import { getAuthToken } from '../tools/auth-helper';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

test.describe('API config', () => {
    let idToken: string;

    test.beforeAll(async ({ playwright }) => {
        const requestContext = await playwright.request.newContext();
        idToken = await getAuthToken(requestContext);
    });

    test('should get the config', async ({ request }) => {
        const configResponse = await request.get(`${BASE_API_URL}/api/config`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Accept': 'application/json'
            }
        });
        expect(configResponse.status()).toBe(200);
        const configBody = await configResponse.json();
    });
});