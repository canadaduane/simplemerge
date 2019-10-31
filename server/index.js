import { startFromGenesisDoc } from './genesis'
import Server from './Server'

const connectionsDoc = startFromGenesisDoc('genesis.json')
const port = 8080

const server = new Server(connectionsDoc)
server.listen(port).on('listening', event => {
  console.log(`Simplemerge websocket listening on port ${port}...`)
})
