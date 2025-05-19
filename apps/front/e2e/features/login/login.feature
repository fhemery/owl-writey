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

    @Automated @P1
    Scenario: Validate the login form 
        When I fill the login form with valid data
        Then I am redirected to the dashboard page from the login page

    @Automated @P1
    Scenario Outline: Wrong data for registration
        When I enter '<value>' in field '<fieldName>'
        Then It should display error '<errorKey>'

        Examples: 
        | value       | fieldName         | errorKey |
        |invalid-email| login            | register.form.email.error.invalid  |
        |             | login            | register.form.email.error.required |
        |             | password          | register.form.password.error.required  |

