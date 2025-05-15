Feature: Exercise Feature

Background:
    Given I am connected as a user
    And Display a new exercise form

    @Automated
    Scenario: Change duration of exercise
      When I change the duration of the exercise to "1 heure"
      Then "1 heure" should be the selected duration

    @Automated
    Scenario: Create a new exercise
      When I fill a new exercise form with valid data
      Then I am redirected to the current exercise

    @Automated
    Scenario: Wrongly create a new exercise
      When I fill a new exercise form with wrong data
      Then It should display an error on the corresponding field

