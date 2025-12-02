Feature: NovelCreate Feature

    Background:
    Given I am connected as a known user
    And Display a new novel form

    @Automated
    Scenario: Create a new novel
        When I fill a new novel form with valid data
        Then I am redirected to the current novel
    