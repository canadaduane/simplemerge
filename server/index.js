import { startFromGenesisDoc } from './genesis'
import Server from './Server'

const connectionsDoc = startFromGenesisDoc('genesis.json')

async function start (port) {
  const server = new Server({
    port,
    connectionsDoc
  })
  await server.listen()
  console.log(`Simplemerge websocket listening on port ${port}...`)
}

start(8080)
