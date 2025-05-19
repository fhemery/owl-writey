Feature: Registration Feature

    Background: 
        Given I go to register page

    @Automated @P0
    Scenario: Display the register form
        Then Register page should be displayed

    @Automated @P1
    Scenario: Login redirection is correct 
        When I click on the Connexion link
        Then Display the login page

    @Automated
    Scenario: Create a new user
        When I fill the registration form with valid data
        Then I am redirected to the dashboard page from the register page

    @Automated
    Scenario Outline: Wrong data for registration
        When I enter '<value>' in field '<fieldName>'
        Then It should display error '<errorKey>'

        Examples: 
        | value       | fieldName         | errorKey |
        | Ed          | name              | register.form.name.error.minlength |
        |             | name              | register.form.name.error.required  |
        |invalid-email| email             | register.form.email.error.invalid  |
        |             | email             | register.form.email.error.required |
        | short       | password          | register.form.password.error.minlength |
        |             | password          | register.form.password.error.required  |
        | short       | repeatPassword    | register.form.repeatPassword.error.minlength |
        |             | repeatPassword    | register.form.repeatPassword.error.required  |
