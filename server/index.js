import WebSocket from 'ws'
import Automerge from 'automerge'
import uuid from 'uuid/v4'
 
import Connection from '../common/connection'

const port = 8080
const wss = new WebSocket.Server({ port })
console.log(`Simplemerge WebSocket listening on port ${port}...`)

const actorId = 'server'

let connectionsDoc = Automerge.change(Automerge.init(), doc => doc.peers = [])



wss.on('connection', ws => {
  const docSet = new Automerge.DocSet()
  // All peers get access to the "connections" doc
  docSet.setDoc('connections', connectionsDoc)
  docSet.registerHandler((docId, doc) => {
    console.log(`[${docId}] ${JSON.stringify(doc)}`)
  })

  const conn = new Connection(Automerge, docSet, ws)

  ws.id = uuid()
  connectionsDoc = Automerge.change(connectionsDoc, doc => doc.peers.push(ws.id))

  // ws.on('message', conn.receiveMsg)
  ws.on('message', msg => {
    console.log('received', msg)
    conn.receiveMsg(msg)
  })
})
