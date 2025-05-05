Feature: Home Feature

  Background:
    Given I go to home page

    @Automated @P0
    Scenario: Display home page
        When I go to home page
        Then Home page should be displayed

    @Automated @P1
    Scenario: Display home page P1
        When I go to home page
        Then Home page should be displayed


    Scenario: Check other link
        When I go to home page
        Then One step that is not defined


    Scenario: Keyboard navigation - Logical tabulation order
        When I navigate with the tab key
        Then It should be in a logical order to reach every interactive elements

