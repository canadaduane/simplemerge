# simplemerge

A simple client-server example of [automerge](https://github.com/automerge/automerge) in action.

One of the issues for newcomers to Automerge is the lack of familiarity with the flexibility in network topology that a state synchronization algorithm like it brings. For example, most web developers are used to a server that listens for client connections--a star topology where the server is always on, and the clients are ephemeral.

While automerge offers many other possible configurations (e.g. peer-to-peer, federated, server-to-server, multi-master-write etc.) I felt it needed a simple example of a familiar topology to get people started. `simplemerge` is that example.

## Server

The server runs a websocket, listening for connections on port 8080:

```
$ yarn install
$ yarn start
```

The server holds a single `connections` document that tracks new peers as they connect to the server. Each peer is given access to this `connections` document so that peers can become aware of each other and start to communicate.

The server also syncs any documents that any of its clients offers up--so if a client creates a new `example` JSON document, that document will be synced with the server, but with access restricted to just that server-client relationship.

## Client

The client is a static HTML page with javascript. It uses `parcel` as a web packager, and can be started in the same way as the server:

```
$ yarn install
$ yarn start
```

Once started, open it up at [http://localhost:1234](http://localhost:1234).
