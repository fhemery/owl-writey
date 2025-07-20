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
      |       | name      | exercise.form.name.error.required |

    
    Scenario: Trial to create a new exercise with negative iteration nb
      When I add a negative figure to the iteration nb
      Then It should display the following error exercise.form.exquisiteCorpse.nbIterations.error.min 

    Scenario: Trial to create a new exercise with an invalid mini-word number
      When I add an invalid figure to the mini-word field
      Then It should display the following error exercise.form.exquisiteCorpse.words.minWords.error.min 
    
    Scenario: Trial to create a new exercise with an invalid maxi-word number
      When I add an invalid figure to the maxi-word field
      Then It should display the following error exercise.form.exquisiteCorpse.words.maxWords.error.min
    
    
    Scenario: Try to create a new exercise without any history content
      When I do not add content in the initialText field
      Then It should display the following error exercise.form.exquisiteCorpse.initialText.error.required 