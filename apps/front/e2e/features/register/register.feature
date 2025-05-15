Feature: Registration Feature

    Background: 
        Given I go to register page

    @Automated @P0
    Scenario: Display the register form
        Then Register page should be displayed

    @Automated @P1
    Scenario: Login redirection is correct 
        When I click on the Connexion link
        Then Display the login page

    @Automated
    Scenario: Create a new user
        When I fill the registration form with valid data
        Then I am redirected to the dashboard page from the register page

    @Automated
    Scenario: Wrongly create a new user
        When I fill the registration form with wrong data
        Then It should display an error on the register form
