import { expect, test } from '@playwright/test';

import { DashboardPo } from '../pages/dashboard.po';
import { ExercisePo } from '../pages/exercise.po';

test.describe('Dashboard page', () => {
    let dashboardPo: DashboardPo;
    let exercisePo: ExercisePo;

    test.beforeEach(async ({ page }) => {
        dashboardPo = new DashboardPo(page);
        exercisePo = new ExercisePo(page);
        await dashboardPo.goTo();
    });

    test('should be displayed', async () => {
        await dashboardPo.shouldBeDisplayed();
    });

    test('should display ended exercises', async () => {
        const endedExercisesDisplayed = await dashboardPo.displayEndedExercises();
        expect(endedExercisesDisplayed).toBe(true);
    });

    test('should redirect to new exercise page', async () => {
        await dashboardPo.createNewExercise();
        await exercisePo.shouldBeDisplayed();
    })
})

