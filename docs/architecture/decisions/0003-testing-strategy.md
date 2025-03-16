# 3. Testing strategy

Date: 2025-03-16

## Status

Accepted

## Context

The purpose of Owl Writey in itself is not complex, but some rules of collaboration (mainly for the exercises) are.
This is the reason why a good testing strategy is necessary.

The strategy may need to be refined as soon as the front gets more attention, but we want the backend to drive 
most of the front-end, and it is clearly the most critical component currently

## Decision

The testing strategy consists will be using the Testing Diamond instead of the usual Pyramid :
* Very few unit tests, centered on difficult business logic
* A lot of integration test, in particular on the back-end, but possibly later on pages of groups of components
* Some E2E tests to check the app is working properly as a whole.

Because we have __NestJs__ and __TypeORM__, the API will be tested as a whole, as follows :
* We will use the __[Nest Testing framework](https://docs.nestjs.com/fundamentals/testing)__ to bootstrap modules
* We will replace the Mysql database by a __Sqlite in memory DB__ for the tests
* We will replace the Authentication middleware by a fake one
* We will replace any dependency that would be too heavy (such as a service sending mails) by a fake.
* We will use __Supertest__ to shoot API requests and check the results

Everything is implemented through a test-utils frameworks, located in [Back test-utils library](../../../libs/back/test-utils/README.md)

## Consequences

* Because NestJs enables easy Integration testing we should be able to check each and every behaviour, except for authentication and a few mocks
* The E2E tests will take care of the rest
* The front still remains to be tested and improved, but there are many issues to solve on back first.
