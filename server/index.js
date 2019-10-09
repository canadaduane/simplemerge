const WebSocket = require('ws');
const Connection = require('./connection')
const Automerge = require('automerge')
 
const wss = new WebSocket.Server({ port: 8080 })

const actorId = 'server'

const connectionsDoc = Automerge.change(Automerge.init(), doc => doc.peers = [])

// docSet.registerHandler((docId, doc) => {
//   console.log(`[${docId}] ${JSON.stringify(doc)}`)
// })


wss.on('connection', ws => {
  const docSet = new Automerge.DocSet()
  // All peers get access to the "connections" doc
  docSet.setDoc('connections', connectionsDoc)

  const automerge = new Automerge.Connection(docSet, msg => {
    console.log('sent', msg)
    ws.send(JSON.stringify(msg))
  })

  ws.on('message', message => {
    automerge.receiveMsg(message)
    console.log('received', message)
  })
})
