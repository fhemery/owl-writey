Feature: Dashboard Feature

    Background:
        Given I am connected
        And Dashboard page should be displayed 

    @Automated
    Scenario: Display new exercise form
        When I click to Create a new exercise
        Then Display the new exercise form
    
    @Automated
    Scenario: Display exercises done
        When I click to exercises done toggle
        Then Display exercises done on the dashboard
    
    @Automated
    Scenario: Display new novel form
        When I click to Create a new novel
        Then Display the new novel form

    @Automated
    Scenario: Display the content of a finished exercise
        Given As a connected user I click to display finished exercises
        When I click on a finished exercise card
        Then Display the finisehd corresponding exercise