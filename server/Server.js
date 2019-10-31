import WebSocket from 'ws'
import Automerge from 'automerge'
import uuid from 'uuid/v4'

import Connection from '../common/connection'

class Server {
  constructor (connectionsDoc) {
    this.connectionsDoc = connectionsDoc
  }

  listen (port) {
    this.server = new WebSocket.Server({ port })
    this.docSet = new Automerge.DocSet()

    this.server.on('connection', this.handleConnection.bind(this))
    
    return this.server
  }

  handleConnection (websocket) {
    this.connection = new Connection(this.docSet, websocket)

    // Whenever a peer connects, we add it to the list, and every peer gets updated
    websocket.id = uuid()
    this.connectionsDoc = Automerge.change(this.connectionsDoc, doc => doc.peers.push(websocket.id))
    this.docSet.setDoc('connections', this.connectionsDoc)

    websocket.on('message', msg => {
      this.connection.receiveMsg(msg)
    })
  }
}

module.exports = Server
