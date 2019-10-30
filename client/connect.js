import Automerge from 'automerge'
import Connection from '../common/connection'

function connect (host, port, docSet) {
  let ws = new window.WebSocket('ws://' + host + ':' + port)
  let conn

  ws.addEventListener('open', event => {
    conn = new Connection(Automerge, docSet, ws)
    console.log('opened websocket', event)
  })

  ws.addEventListener('close', event => {
    if (conn) conn.close()
    ws = null
    conn = null
    console.log('closed websocket', event)
  })

  // Listen for messages
  ws.addEventListener('message', event => {
    if (conn) conn.receiveMsg(event.data)
  })

  return ws
}

module.exports = connect
