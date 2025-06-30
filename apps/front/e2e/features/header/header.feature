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


Scenario: Logout action is correct from the header
    Given The user is connected
    When The user menu is opened
    And I select "Logout" from the menu
    Then Display the home page from the header
