Feature: E2E Feature

    Background:
    Given I am on the owl-writey homepage

    @Automated
    Scenario: Whole exercise process
        When I log as a known user for creating an exercise
        Then I can try to take a turn on it, submit, cancel my turn
        And I finally delete the exercise
