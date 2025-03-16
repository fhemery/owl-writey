# 2. Angular and Nest framework choices

Date: 2025-03-16

## Status

Accepted

## Context

When creating the application, we had to come up with a certain number of choices regarding the 
frameworks we want to use. We need a front-end, a back-end framework and a database.

Owl-writey is a writing app that was mostly thought as an online app, but there might be a wish to 
have it work offline, possibly later on with Electron.

## Decision

* We chose __Angular__ for the front-end framework. It is a popular framework that will 
be useful whenever we want to use DI to propose multiple implementations
* We chose __NestJs__ for the back-end, as the most logical choice in terms of TS frameworks maturity
and the one that aligns the most with Angular
* We chose __Firebase__ for the authentication, as an easy to implement third party.
* We chose a __Mysql__ database, but this choice is not set in stone, as we hide all the logic behind __TypeORM__ 

## Consequences

We are now settled in the Typescript world. The TypeORM logic binds us to a Sql database, but even that could 
be changed if need be as the back-end architecture is mostly hexagonal.

We haven't yet decided if we want an offline mode using __PWA__ or __Electron__. PWA should be the most natural
choice (even for online), but Electron will be more powerful
