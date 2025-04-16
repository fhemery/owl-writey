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
Scenario: Dashboard redirection is correct from the header
    Given The user is connected
    When I click on the Dashboard button
    Then Display the dashboard page from the header

@Automated
Scenario: Logout action is correct from the header
    Given The user is connected
    When I click on the Logout button
    Then User is logged out 
    And Display the home page from the header

@Automated
Scenario: Homepage redirection is correct from the header
    Given The user is connected 
    And The user is on the dashboard page
    When I click on the Title button
    Then Display the home page from the headers title