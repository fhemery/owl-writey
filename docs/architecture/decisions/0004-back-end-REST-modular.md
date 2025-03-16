# 4. Back-end REST modular architecture

Date: 2025-03-16

## Status

Accepted

## Context

The Owl-Writey app might go in a lot of directions. Writing apps have a lot of features that are expected,
and as such a lot of features could be planned. To these features comes the wish to enable several people to
collaborate one exercises and novels.
As indicated in [the ADR regarding testing strategy](./0003-testing-strategy.md), we are leveraging the NestJS
capabilities to have a very strong coverage.

## Decision

The back-end architecture will have the following characteristics :
* It will use the power of [NX](https://nx.dev) monorepository to split the application into __loosely coupled modules__
* Each functional module will expose a __REST API__, using __HATEOAS__ as much as possible to enable "dumb fronts"
* Each module can have its own architecture, depending on the evolution of requirements for the module. This is made possible thanks to the tests from outside
* Each module will be independent in terms of data, which means __No Foreign keys are allowed on Tables of different modules__
* As a consequence of previous points, we will need to use __Event Driven Architecture__ to transfer some information from one module to another (more on this later)

## Consequences

### Advantages 
With such a modular infrastructure, we should be able to keep throwing features and yet have something fully functional.

### Drawbacks
This architecture comes with a cost :
1. Because our module are loosely coupled, we might need to __duplicate data__.
For example, username will be replicated to save querying time everytime we want user information.
2. As we have data duplication, we need __Event Driven Architecture__, which makes some of the flows harder to follow
But we foresee this would have been necessary anyway, for example to hook the stats without messing up the other modules.
3. This comes with additional complexity, that should be leverage by the high coverage
