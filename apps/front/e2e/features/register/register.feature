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
    Scenario Outline: Registration form validation
        When I fill the registration form with "<field>"
        Then "<result>" should be displayed

        Examples: 
            |       field       |                result                 |
            |    ValidPseudo    | I am redirected to the dashboard page |
            |   InvalidPseudo   |       It should display an error      |
            |    EmptyPseudo    |       It should display an error      |
            |     ValidEmail    | I am redirected to the dashboard page |
            |   InvalidEmail    |       It should display an error      |
            |    EmptyEmail     |       It should display an error      |
            |   ValidPassword   | I am redirected to the dashboard page |
            |  InvalidPassword  |       It should display an error      |
            |   EmptyPassword   |       It should display an error      |
            | ValidRepeatedPswd | I am redirected to the dashboard page |
            |InvalidRepeatedPswd|       It should display an error      |
            | EmptyRepeatedPswd |       It should display an error      |
            |  ExistingAccount  |       It should display an error      |