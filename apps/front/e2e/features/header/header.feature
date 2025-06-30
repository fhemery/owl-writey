Feature: Header Feature

Background:
    Given I am on the Homepage

@Automated
Scenario: Login redirection is correct from the header
    Given The user is not connected
    When I click on the Login button
    Then Display the login page from the header

@Automated
Scenario: Register redirection is correct from the header
    Given The user is not connected
    When I click on the Register button
    Then Display the register page from the header

@Automated
Scenario: Logout redirection is correct from the header
    Given The user is connected
    When I open the user menu
    And I select "Déconnexion" from the menu
    Then Display the home page from the header

@Automated
Scenario: The dashboard redirection is correct from the header title
    Given The user is connected
    When I click on the title header
    Then Display the dashboard page from the header
