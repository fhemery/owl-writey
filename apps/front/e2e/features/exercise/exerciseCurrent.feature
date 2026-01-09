Feature: ExerciseCurrent Feature

Background:
    Given I am logged as a user
    And I display what it is needed to create an exercise

    @Automated
    Scenario: Participate to an exercise
      When I click to take my turn
      Then I can fill with content and submit it

    @Automated
    Scenario: Cancel my turn to an exercise
      When It is my turn
      Then I click to cancel my turn

    @Automated
    Scenario: End an exercise
    When I click to end an exercise
    Then Redirect to the dashboard page
    
    @Automated
    Scenario: Delete an exercise
      When I click to delete an exercise
      Then Display the dashboard page
