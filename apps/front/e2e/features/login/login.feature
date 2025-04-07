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
Scenario Outline: Login form validation
    When I fill the login form with "<field>"
    Then "<result>" should be displayed for login

    Examples:
    |          field         |                result                 |
    |     LoginValidEmail    | I am redirected to the dashboard page |
    |   LoginInvalidEmail    |       It should display an error      |
    |    LoginEmptyEmail     |       It should display an error      |
    |   LoginValidPassword   | I am redirected to the dashboard page |
    |  LoginInvalidPassword  |       It should display an error      |
    |   LoginEmptyPassword   |       It should display an error      |