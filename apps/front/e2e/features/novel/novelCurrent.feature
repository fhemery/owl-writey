Feature: NovelCurrent Feature

Background:
    Given I am logged

    @Automated
    Scenario: Display a novel
      When I click on a novel card 
      Then Display the corresponding novel

    @Automated
    Scenario: Delete a novel
      Given The current novel is displayed
      When I delete a novel
      Then Display the dashboard

    @Automated
    Scenario: Update a novel
      Given A precise novel is displayed
      When I update a novel
      Then Display the novel form updated