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
    Scenario: Display current exercise
        When I click the Jouer button for exercise "<title>"
        Then Display the current exercise clicked on

        Examples:
            |                         title                          |
            |                 Test le cadavre exquis                 |
            |Lorem ipsum dolor sit amet, consectetur adipiscing elit.|