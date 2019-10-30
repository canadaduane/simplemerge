import Automerge from 'automerge'
import WebSocket from 'isomorphic-ws'

import Connection from '../common/connection'

function connect (host, port, docSet) {
  let ws = new WebSocket('ws://' + host + ':' + port)
  let conn

  ws.addEventListener('open', event => {
    conn = new Connection(Automerge, docSet, ws)
    console.log('opened client websocket')
  })

  ws.addEventListener('close', event => {
    if (conn) conn.close()
    ws = null
    conn = null
    console.log('closed client websocket')
  })

  // Listen for messages
  ws.addEventListener('message', event => {
    if (conn) conn.receiveMsg(event.data)
  })

  return ws
}

module.exports = connect
