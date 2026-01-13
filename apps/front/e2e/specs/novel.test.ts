import { expect, test } from '@playwright/test';
import { getAuthToken } from '../tools/auth-helper';
import { v4 as uuidv4 } from 'uuid';

const BASE_API_URL = process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:3000';

interface Novel {
   id: string;
   title: string;
   description?: string;
}

test.describe('API novel', () => {
   let idToken: string;
   const NOVEL_NAME = `API Test ${Date.now()}`;


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
            },
            data: novelData
        });

        expect(novelResponse.status()).toBe(201);

        const listResponse = await request.get(`${BASE_API_URL}/api/novels`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
            }
        });
        const result = await listResponse.json();
        const novelList = result.data as Novel[];
        const createdBody = novelList.find(n => n.title === novelData.title);

        expect(createdBody).toBeDefined();
         if(createdBody) {
           // console.log("Structure réelle de l'exercice reçu :", JSON.stringify(createdBody, null, 2));
           expect(createdBody.title).toBe(novelData.title);
           expect(createdBody.description).toBe(novelData.description);
        }
    });

    test('should fetch a single novel', async ({ request }) => {
        const novelData = {
           "title": NOVEL_NAME,
           "description": "Api test description"
        };

        await request.post(`${BASE_API_URL}/api/novels`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
            },
            data: novelData
        });

        const listResponse = await request.get(`${BASE_API_URL}/api/novels`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
            }
        });
        const novelResult = await listResponse.json();
        const novelList = Array.isArray(novelResult) ? novelResult : novelResult.data;
        const firstNovel = novelList[0];

        expect(firstNovel).toBeDefined();
        const novelId = firstNovel.id;

        const novelResponse = await request.get(`${BASE_API_URL}/api/novels/${novelId}`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
               'Accept': 'application/json'
            }
        });
        expect(novelResponse.status()).toBe(200);

        const novelBody = await novelResponse.json();
        expect(novelBody.id).toBe(novelId);
        expect(novelBody).toHaveProperty('generalInfo.title');
        expect(novelBody).toHaveProperty('generalInfo.description');

       expect(novelBody.generalInfo.title).toBe(firstNovel.title);
    });
   
    test('should update a novel and log TitleChanged event', async ({ request }) => {
        const listResponse = await request.get(`${BASE_API_URL}/api/novels`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const novelResult = await listResponse.json();
        const novelList = Array.isArray(novelResult) ? novelResult : novelResult.data;
        const novelId = novelList[0].id; 

        const getResponse = await request.get(`${BASE_API_URL}/api/novels/${novelId}`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const fullNovel = await getResponse.json();

        const newTitle = "This title is a TEST"; 
        fullNovel.generalInfo.title = newTitle;

        const updateResponse = await request.put(`${BASE_API_URL}/api/novels/${novelId}`, {
            headers: { 
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json' 
            },
            data: fullNovel
        });
        expect(updateResponse.status()).toBe(204);

        const uniqueEventId = uuidv4();
        const eventPayload = {
            eventId: uniqueEventId,
            eventName: 'Novel:TitleChanged',
            eventVersion: '1',
            data: {
                title: newTitle
            }
        };

        const eventResponse = await request.post(`${BASE_API_URL}/api/novels/${novelId}/events`, {
            headers: { 
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            data: eventPayload
        });

        // if (eventResponse.status() !== 204) {
        //     console.log("Détail erreur Event:", await eventResponse.text());
        // }

        expect(eventResponse.status()).toBe(204);

        const verifyResponse = await request.get(`${BASE_API_URL}/api/novels/${novelId}`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const body = await verifyResponse.json();
        expect(body.generalInfo.title).toBe(newTitle);
    });

    test('should delete a novel', async ({ request }) => {
        const novelData = {
           "title": NOVEL_NAME,
           "description": "Api test description"
        };

        await request.post(`${BASE_API_URL}/api/novels`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
            },
            data: novelData
        });

        const listResponse = await request.get(`${BASE_API_URL}/api/novels`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
            }
        });
        const novelResult = await listResponse.json();
        const novelList = Array.isArray(novelResult) ? novelResult : novelResult.data;
        const novelId  = novelList[0].id; 

        const deleteResponse = await request.delete(`${BASE_API_URL}/api/novels/${novelId}`, {
            headers: {
               'Authorization': `Bearer ${idToken}`,
            }
        }); 

        expect(deleteResponse.status()).toBe(204);
    });

    // test('should update a novel and verify it in the events history', async ({ request }) => {
    //     // 1. RÉCUPÉRATION DU NOVELID
    //     const listResponse = await request.get(`${BASE_API_URL}/api/novels`, {
    //         headers: { 'Authorization': `Bearer ${idToken}` }
    //     });
    //     const novelResult = await listResponse.json();
    //     const novelList = Array.isArray(novelResult) ? novelResult : novelResult.data;
    //     const novelId = novelList[0].id; 

    //     // 2. ACTION 1 : MISE À JOUR (PUT)
    //     const newTitle = "The Great Adventure"; 
    //     // On récupère l'objet complet pour le PUT (indispensable pour ta structure)
    //     const getNovel = await request.get(`${BASE_API_URL}/api/novels/${novelId}`, {
    //         headers: { 'Authorization': `Bearer ${idToken}` }
    //     });
    //     const fullNovel = await getNovel.json();
    //     fullNovel.generalInfo.title = newTitle;

    //     const updateRes = await request.put(`${BASE_API_URL}/api/novels/${novelId}`, {
    //         headers: { 'Authorization': `Bearer ${idToken}` },
    //         data: fullNovel
    //     });
    //     expect(updateRes.status()).toBe(204);

    //     // 3. ACTION 2 : NOTIFICATION DE L'ÉVÉNEMENT (POST)
    //     const uniqueEventId = uuidv4();
    //     const eventPayload = {
    //         eventId: uniqueEventId,
    //         eventName: 'Novel:TitleChanged',
    //         eventVersion: '1',
    //         data: { title: newTitle }
    //     };

    //     const eventRes = await request.post(`${BASE_API_URL}/api/novels/${novelId}/events`, {
    //         headers: { 'Authorization': `Bearer ${idToken}` },
    //         data: eventPayload
    //     });
    //     expect(eventRes.status()).toBe(204);
    // });

    test('should delete all novels', async ({ request }) => {
        const deleteResponse = await request.delete(`${BASE_API_URL}/api/novels`, {
            headers: { 'Authorization': `Bearer ${idToken}` }
        });
        expect(deleteResponse.status()).toBe(200);
    });
});
