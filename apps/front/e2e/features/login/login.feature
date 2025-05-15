Feature: Login Feature

    Background:
        Given I go to login page

    @Automated @P0
    Scenario: Display login form
        Then Login page should be displayed

    @Automated @P1
    Scenario: Register redirection is correct
        When I click on the Register link
        Then Display registration page

    @Automated
    Scenario: Validate the login form 
        When I fill the login form with valid data
        Then I am redirected to the dashboard page from the login page

    @Automated
    Scenario: Invalidate the login form 
        When I fill the login form with wrong data
        Then It should display an error on the login form


