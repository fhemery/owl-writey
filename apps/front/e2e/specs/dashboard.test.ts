import { expect, test } from '@playwright/test';

import { LoginPo } from '../pages/login.po';
import { DashboardPo } from '../pages/dashboard.po';
import { ExercisePo } from '../pages/exerciseCreate.po';

test.describe('Dashboard page', () => {
    let loginPo: LoginPo;
    let dashboardPo: DashboardPo;
    let exercisePo: ExercisePo;

    test.beforeEach(async ({ page }) => {
        // console.log('🔧 beforeEach started');
        loginPo = new LoginPo(page);
        dashboardPo = new DashboardPo(page);
        exercisePo = new ExercisePo(page);

        await loginPo.goTo();
        await loginPo.logAs('bob@hemit.fr', 'Test123!');

        await dashboardPo.goTo();
    });
    
    test('should be displayed', async ({ page }) => {
        await page.pause();
        await dashboardPo.shouldBeDisplayed();
    });

    test('should display ended exercises', async () => {
        const endedExercisesDisplayed = await dashboardPo.displayEndedExercises();
        expect(endedExercisesDisplayed).toBe(true);
    });

    test('should redirect to new exercise page', async () => {
        await dashboardPo.createNewExercise();
        await exercisePo.shouldDisplayForm();
    })
})

