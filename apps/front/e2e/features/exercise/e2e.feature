Feature: E2E Feature

    Background:
    Given I am on the owl-writey homepage

    @Automated
    Scenario: Exercise process
        When I log as a known user for creating an exercise
        Then I can try to take a turn on it, submit, cancel my turn, finish the exercise
        And I finally delete the exercise

    @Automated
    Scenario: Novel process
        When I register as a new user
        Then I can create, update a novel 
        And I can delete the current novel 
