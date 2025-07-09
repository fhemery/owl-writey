Feature: ExerciseCurrent Feature

Background:
    Given I am logged as a user

    @Automated
    Scenario: Display a current exercise
      When I click on an exercise card 
      Then Display the current corresponding exercise