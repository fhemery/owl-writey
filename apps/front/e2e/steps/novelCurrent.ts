import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
Given('I display the corresponding current novel', async ({ novelCurrentPo, novelCardPo } : AllFixtures) => {
    await novelCardPo.getNovelCardTitle('This novel is a test');
    await novelCardPo.displayNovelCard('This novel is a test');
    await novelCurrentPo.shouldBeDisplayed();
});

When('I click on a novel card', async ({ novelCardPo } : AllFixtures) => {
    await novelCardPo.getNovelCardTitle('Test d\'une application de romans');
    await novelCardPo.displayNovelCard('Test d\'une application de romans');
});
Then('Display the corresponding novel', async ({ page, novelCurrentPo }: AllFixtures) => {
    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/novels/3bde73fb-7cc2-432f-825f-61fc325f8080') && 
        response.request().method() === 'GET' && 
        response.status() === 200 
    );
    
    await novelCurrentPo.shouldBeDisplayed();
    
    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});

When('I delete a novel', async ({  page, novelHeaderPo, novelCreatePo, confirmDialogPo } : AllFixtures) => {
    await novelHeaderPo.updateInfo();
    await novelCreatePo.deleteNovel();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/novels/') && 
        response.request().method() === 'DELETE' && 
        response.status() === 204 
    );

    await confirmDialogPo.filledAs('This novel is a test');
    await confirmDialogPo.confirmDeleteAction();

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('Display the dashboard', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

When('I update a novel', async ({ page, novelHeaderPo, novelCreatePo } : AllFixtures) => {
    await novelHeaderPo.updateInfo();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/novels/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await novelCreatePo.updateNovel('This is an amazing story');

    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
Then('Display the novel form updated', async ({ novelCreatePo}: AllFixtures) => {
    await novelCreatePo.shouldBeDisplayed();
});

When('I click to add a first chapter', async ({ novelOvervwNoChapPo } : AllFixtures) => {
    await novelOvervwNoChapPo.addFirstChapter();
});
Then('Display the novel detail to add it', async ({ page,novelOvervwChapCardPo, novelCorkboardPo }: AllFixtures) => {
    await novelOvervwChapCardPo.shouldBeDisplayed();

    const getResponsePromise = page.waitForResponse(response => 
        response.url().includes('/api/novels/') && 
        response.request().method() === 'POST' && 
        response.status() === 204 
    );

    await novelOvervwChapCardPo.fillChapterTitle('Testing chapter');
    
    await novelOvervwChapCardPo.shouldBeDisplayed();
    await novelCorkboardPo.addNewChapter();
    
    const response = await getResponsePromise;

    console.log(`URL de la requête API: ${response.url()}`);
    console.log(`Méthode de la requête: ${response.request().method()}`);
    console.log(`Statut de la réponse: ${response.status()}`);
});
