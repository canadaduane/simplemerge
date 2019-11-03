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

  console.log('Connecting client...')
  const client1 = new Client({
    host: 'localhost',
    port
  })
  addOne(client1.docSet)
  await client1.connect()
  await delay(500)

  const client2 = new Client({
    host: 'localhost',
    port
  })
  await client2.connect()
  addOne(client2.docSet)
  await delay(500)

  console.log('Reconnecting client1...')
  await client1.disconnect()
  await client1.connect()
  addOne(client1.docSet)
  await delay(500)

  console.log('Reconnecting client1...')
  await client2.disconnect()
  await client2.connect()
  addOne(client2.docSet)
  await delay(500)

  console.log('Restarting server...')
  await server.close()
  await server.listen()

  await delay(200)
  await client1.connect()
  await client2.connect()
  addOne(client2.docSet)

  await delay(500)

  await server.close()
  await server.listen()

  await client1.connect()
  await client2.connect()
  addOne(client1.docSet)

  await delay(1000)
  console.log('Restarting server...')
  await server.close()
  await server.listen()
  await delay(200)
  await client1.connect()
  await client2.connect()
  // 8. BOOM?
}

module.exports = {
  testReconnectServer
}
