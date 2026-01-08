import { APIRequestContext, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const FIREBASE_API_KEY = process.env['OWL_FIREBASE_API_KEY'];
    
    const response = await request.post(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_API_KEY}`,
        {
            data: {
                email: 'bob@hemit.fr',
                password: 'Test123!',
                returnSecureToken: true
            }
        }
    );

    expect(response.ok(), "Erreur lors de la récupération du token Firebase").toBeTruthy();
    const authData = await response.json();
    return authData.idToken;
}