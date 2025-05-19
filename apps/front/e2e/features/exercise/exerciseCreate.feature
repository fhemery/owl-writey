Feature: ExerciseCreate Feature

Background:
    Given I am connected as a user
    And Display a new exercise form

    @Automated
    Scenario: Change duration of exercise
      When I change the duration of the exercise to "1 heure"
      Then "1 heure" should be the selected duration

    @Automated
    Scenario: Create a new exercise
      When I fill a new exercise form with valid data
      Then I am redirected to the current exercise
    
    Scenario: Wrong title for exercise
      When I enter 'a' in field 'name'
      # When I enter an invalid value in the exercise field
      # When I select '15 minutes' from field 'duration'
      Then It should display error 'exercise.form.name.error.minlength'

    @Automated
    Scenario Outline: Wrong data for exercise
      When I enter '<value>' in field '<fieldName>'
      # When I enter an invalid value in the exercise field
      # When I select '15 minutes' from field 'duration'
      Then It should display error '<errorKey>'

      Examples: 
      | value | fieldName | errorKey |
      | a     | name      | exercise.form.name.error.minlength |
