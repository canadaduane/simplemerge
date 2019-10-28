# simplemerge

A simple client-server topology for (automerge)[https://github.com/automerge/automerge].

## Server

The server runs a websocket, listening for connections on port 8080:

```
$ yarn install
$ yarn start
```

## client

The client is a static HTML page with javascript. It uses `parcel` as a web packager, and can be started in the same way as the server:

```
$ yarn install
$ yarn start
```

