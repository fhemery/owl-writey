Feature: Header Feature

Background:
    Given I am on the Homepage

Scenario: Login redirection is correct from the header
    Given The user is not connected
    When I click on the Login button
    Then Display the login page

Scenario: Register redirection is correct from the header
    Given The user is not connected
    When I click on the Register button
    Then Display the register page

Scenario: Dashboard redirection is correct from the header
    Given The user is connected
    When I click on the Dashboard button
    Then Display the Dashboard page

Scenario: Logout action is correct from the header
    Given The user is connected
    When I click on the Logout button
    Then User is logged out 
    And Display the not logged Homepage