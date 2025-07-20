Feature: ExerciseCurrent Feature

Background:
    Given I am logged as a user

    @Automated
    Scenario: Display a current exercise
      When I click on an exercise card 
      Then Display the current corresponding exercise

    @Automated
    Scenario: Particpate to an exercise
      Given I display the corresponding exercise
      When I click to take my turn
      Then I can fill with content and submit it