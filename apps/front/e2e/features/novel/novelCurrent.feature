Feature: NovelCurrent Feature

Background:
    Given I am logged

    @Automated
    Scenario: Display a novel
      When I click on a novel card 
      Then Display the corresponding novel