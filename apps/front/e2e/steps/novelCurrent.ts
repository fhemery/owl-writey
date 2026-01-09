import { createBdd } from "playwright-bdd";

import { AllFixtures, pageFixtures } from "../support/fixtures";

export const fixtures = pageFixtures;
const { Given, When, Then } = createBdd(fixtures);

Given('I am logged', async ({ loginPo, dashboardPo } : AllFixtures) => {
    await loginPo.goTo();
    await loginPo.logAs('bob@hemit.fr', 'Test123!');
    await dashboardPo.shouldBeDisplayed();
});
Given('I display the corresponding current novel', async ({ dashboardPo, novelCreatePo, novelCurrentPo, novelCardPo } : AllFixtures) => {
    await dashboardPo.createNewNovel();
    await novelCreatePo.shouldDisplayForm();
    await novelCreatePo.createNovel('This novel is a test');
    // await novelCardPo.getNovelCardTitle('This novel is a test');
    // await novelCardPo.displayNovelCard('This novel is a test');
    await novelCurrentPo.shouldBeDisplayed();
});

// Delete a novel
When('I delete a novel', async ({  page, novelHeaderPo, novelCreatePo, confirmDialogPo } : AllFixtures) => {
    await novelHeaderPo.updateInfo();
    await novelCreatePo.deleteNovel();
    await confirmDialogPo.filledAs('This novel is a test');
    await confirmDialogPo.confirmDeleteAction();
});
Then('Display the dashboard', async ({ dashboardPo }: AllFixtures) => {
    await dashboardPo.shouldBeDisplayed();
});

// Update a novel
When('I update a novel', async ({ page, novelHeaderPo, novelCreatePo } : AllFixtures) => {
    await novelHeaderPo.updateInfo();
    await novelCreatePo.updateNovel('This is an amazing story');
});
Then('Display the novel form updated', async ({ novelCreatePo}: AllFixtures) => {
    await novelCreatePo.shouldBeDisplayed();
});

// Create a new chapter in a current novel
When('I click to add a first chapter', async ({ novelOvervwNoChapPo } : AllFixtures) => {
    await novelOvervwNoChapPo.addFirstChapter();
});
Then('Display the novel detail to add it', async ({ page,novelOvervwChapCardPo, novelCorkboardPo }: AllFixtures) => {
    await novelOvervwChapCardPo.shouldBeDisplayed();
    await novelOvervwChapCardPo.fillChapterTitle('Testing chapter');
    await novelOvervwChapCardPo.shouldBeDisplayed();
    await novelCorkboardPo.addNewChapter();

});
