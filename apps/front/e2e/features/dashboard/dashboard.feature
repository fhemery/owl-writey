Feature: Dashboard Feature

    Background:
        Given I go to dashboard page

    @Automated @P0
    Scenario: Display the dashboard page
        Then Dashboard page should be displayed

    @Automated
    Scenario: Display exercises done
        When I click to exercises done toggle
        Then Display exercises done on the dashboard
    
    @Automated
    Scenario: Display new exercise form
        When I click to Create a new exercise
        Then Redirect and display the new exercises form
    