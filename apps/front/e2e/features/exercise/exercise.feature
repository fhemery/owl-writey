Feature: Exercise Feature

    Background: 
        Given I am connected as a user
        And Display a new exercise form

    @Automated
    Scenario Outline: New exercise form 
        When I fill a new exercise form with "<field>"
        Then "<result>" should be displayed for exercise

        Examples:
        |         field        |                result                 |
        |       ValidName      |I am redirected to the current exercise|
        |      InvalidName     |       It should display an error      |
        |       EmptyName      |       It should display an error      |
        |   ValidNbIterations  |I am redirected to the current exercise|
        |  InvalidNbIterations |       It should display an error      |
        |ValidIterationDuration|I am redirected to the current exercise|
        |     ValidMinWords    |I am redirected to the current exercise|
        |    InvalidMinWords   |       It should display an error      |
        |     ValidMaxWords    |I am redirected to the current exercise|
        |    InvalidMaxWords   |       It should display an error      |
        | MinMaxWordsComparison|       It should display an error      |
        |   ValidInitialText   |I am redirected to the current exercise|
        |  InvalidInitialText  |       It should display an error      |
        |    EmptyInitialText  |       It should display an error      |

