import WebSocket from 'ws'
import Automerge from 'automerge'
import uuid from 'uuid/v4'

import Connection from '../common/connection'

class Server {
  constructor ({ port, connectionsDoc, onConnect }) {
    this.port = port || 8080
    this.connectionsDoc = connectionsDoc || Automerge.init()
    this.onConnect = onConnect || (() => {})
  }

  async listen () {
    this.server = new WebSocket.Server({ port: this.port })
    this.docSet = new Automerge.DocSet()

    this.server.on('connection', this.handleConnection.bind(this))

    return new Promise((resolve, reject) => {
      this.server.on('listening', resolve)
    })
  }

  async close () {
    return new Promise((resolve, reject) => {
      this.server.close(resolve)
    })
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

    this.onConnect()
  }
}

module.exports = Server
