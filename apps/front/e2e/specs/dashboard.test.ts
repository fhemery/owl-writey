import * as dotenv from 'dotenv';
import { expect, test } from '@playwright/test';

import { DashboardPo } from '../pages/dashboard.po';
import { ExerciseCardPo } from '../pages/exerciseCard.po';
import { ExerciseCreatePo } from '../pages/exerciseCreate.po';
import { LoginPo } from '../pages/login.po';

dotenv.config();
// const BASE_URL: string = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://localhost:3000/api';

test.describe('Dashboard page', () => {
    let dashboardPo: DashboardPo;
    let exerciseCardPo: ExerciseCardPo;
    let exerciseCreatePo: ExerciseCreatePo;
    let exerciseCurrentPo: ExerciseCardPo;
    let loginPo: LoginPo;

    test.beforeEach(async ({ page, request }) => {
        dashboardPo = new DashboardPo(page);
        exerciseCardPo = new ExerciseCardPo(page);
        exerciseCreatePo = new ExerciseCreatePo(page);
        exerciseCurrentPo = new ExerciseCardPo(page);
        loginPo = new LoginPo(page);

        console.log('Ready for testing');
        await loginPo.goTo();
        console.log('Login page displayed');
        await loginPo.logAs('bob@hemit.fr', 'Test123!');
        console.log('User logged in');

        await dashboardPo.goTo();
        console.log('Dashboard page displayed');     
    });
    
    test('should be displayed and display exercises', async ({ page, request }) => {
        console.log('Checking the dashboard displaying');
        // await page.pause();
        await dashboardPo.shouldBeDisplayed();

        const exercisesResponse  = await request.get('/api/exercises');

        await expect(exercisesResponse.status()).toBe(200);
        const exercisesBody = await exercisesResponse.json();
        
        await expect(Array.isArray(exercisesBody)).toBe(true); 
        await expect(exercisesBody.length).toBeGreaterThanOrEqual(1);

        console.log(`API vérifiée. ${exercisesBody.length} exercices trouvés.`);
    });

    // test('should display ended exercises', async () => {
    //     const endedExercisesDisplayed = await dashboardPo.displayEndedExercises();
    //     expect(endedExercisesDisplayed).toBe(true);
    // });

    // test('should redirect to new exercise page', async () => {
    //     await dashboardPo.createNewExercise();
    //     // await exercisePo.shouldDisplayForm();
    // });
});

