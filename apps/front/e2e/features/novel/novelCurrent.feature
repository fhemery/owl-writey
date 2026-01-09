Feature: NovelCurrent Feature

Background:
    Given I am logged
    And  I display the corresponding current novel

    Scenario: Display a novel
      When I click on a novel card 
      Then Display the corresponding novel

    @Automated
    Scenario: Update a novel
      When I update a novel
      Then Display the novel form updated

    @Automated
    Scenario: Create a new chapter in a current novel
      When I click to add a first chapter
      Then Display the novel detail to add it

    @Automated
    Scenario: Delete a novel
      When I delete a novel
      Then Display the dashboard

    