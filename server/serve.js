import WebSocket from 'ws'
import Automerge from 'automerge'
import uuid from 'uuid/v4'

import Connection from '../common/connection'

const serve = (port, connectionsDoc) => {
  const wss = new WebSocket.Server({ port })

  // All peers have access to the same docSet, for simplicity
  const docSet = new Automerge.DocSet()

  wss.on('connection', ws => {
    const conn = new Connection(Automerge, docSet, ws)

    // Whenever a peer connects, we add it to the list, and every peer gets updated
    ws.id = uuid()
    connectionsDoc = Automerge.change(connectionsDoc, doc => doc.peers.push(ws.id))
    docSet.setDoc('connections', connectionsDoc)

    ws.on('message', msg => {
      conn.receiveMsg(msg)
    })
  })

  return wss
}

module.exports = serve
