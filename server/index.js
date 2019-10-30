import fs from 'fs'
import WebSocket from 'ws'
import Automerge from 'automerge'
import uuid from 'uuid/v4'

import Connection from '../common/connection'

const port = 8080
const wss = new WebSocket.Server({ port })
console.log(`Simplemerge WebSocket listening on port ${port}...`)

const genesisFile = 'genesis.json'

const makeGenesis = () => {
  const genDoc = Automerge.change(Automerge.init(), doc => { doc.peers = [] })
  fs.writeFileSync(genesisFile, Automerge.save(genDoc))
  return genDoc
}

const loadGenesis = () => {
  return Automerge.load(fs.readFileSync(genesisFile))
}

let connectionsDoc
try {
  connectionsDoc = loadGenesis()
} catch (e) {
  connectionsDoc = makeGenesis()
}

// All peers have access to the same docSet, for simplicity
const docSet = new Automerge.DocSet()
docSet.registerHandler((docId, doc) => {
  // console.log(`"${docId}": ${JSON.stringify(doc)}`)
})

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
