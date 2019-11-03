import Automerge from 'automerge'
import Server from '../server/Server'
import { startFromGenesisDoc } from '../server/genesis'
import Client from '../client/Client'
import delay from '../common/delay'

/**
 * Failure sequence:
 * 1. start the server
 * 2. start the client & connect
 * 3. stop the server
 * 4. start the server
 * 5. let client and server sync
 * 6. restart the client
 * 7. let client and server sync
 * 8. BOOM server dies "RangeError: Cannot pass an old state object to a connection"
 * 
 * New failure seq:
 * 1. start server
 * 2. start client1
 * 3. inc client1
 * 4. start client2
 * 5. inc client2
 * 6. restart client1
 * 7. restart server
 */

const addOne = (docSet) => {
  let doc = docSet.getDoc('example')
  if (doc) {
    doc = Automerge.change(doc, doc => { doc.counter = doc.counter + 1 })
  } else {
    doc = Automerge.change(Automerge.init(), doc => { doc.counter = 0 })
  }
  docSet.setDoc('example', doc)
}

const testReconnectServer = async () => {
  const connDoc = startFromGenesisDoc('genesis.json')
  // const connDoc = Automerge.change(Automerge.init(), doc => { doc.peers = [] })

  const port = 8089

  console.log('Setting up server...')
  const server = new Server({
    port,
    connectionsDoc: connDoc
  })

  await server.listen()

  console.log('Connecting client1...')
  let client1 = new Client({
    host: 'localhost',
    port
  })
  addOne(client1.docSet)
  await client1.connect()
  await delay(500)

  console.log('Connecting client2...')
  let client2 = new Client({
    host: 'localhost',
    port
  })
  addOne(client2.docSet)
  await client2.connect()
  await delay(500)

  client1.disconnect()
  console.log('Restart client1')
  client1 = new Client({
    host: 'localhost',
    port
  })
  await client1.connect()
  await delay(500)

  console.log('Restart server...')
  await server.close()
  await server.listen()
  
  await client1.connect()
  await client2.connect()
  // 8. BOOM?
}

module.exports = {
  testReconnectServer
}
