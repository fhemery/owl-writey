# 5. Using Server-Side Event over Websocket for Exquisite corpse

Date: 2025-03-16

## Status

Accepted

## Context

Exquisite corpse is a collaborative writing exercise that require different authors to take turn and 
add some words to an existing story. As such, it requires some real time communication

The original implementation uses Websockets, more precisely the [Socket.io](https://github.com/socketio/socket.io) flavour. It had a nice
advantage, which was to default to http long polling if needed (and the actual host does not manage Websockets 
well).

However, another contender entered the mix at some point : [Server sent events](https://docs.nestjs.com/techniques/server-sent-events)

Lightweight, using HTTP, with automated reconnection capabilities, it fits well with the wish for a [HATEOAS heavy architecture](./0004-back-end-REST-modular.md).

## Decision
* We will be dropping Websocket implementation for the exquisite corpse exercise and overall activity notification
starting today (2025/03/16), commit [6f5d211408e9](https://github.com/fhemery/owl-writey/commit/6f5d211408e9bded92c7a0bcab694fde646f5a08)
* Server-Sent Events will be the replacement
* __We will not drop (yet!) the socket.io dependencies__ in the project. We will keep the websocket gateways 
ready for reuse, should the need arise. We will reconsider if ever websocket related code gives us headache during upgrades.

## Consequences

* SSE will be documented (link to be added later) and will become the go-to mode for server notifications
