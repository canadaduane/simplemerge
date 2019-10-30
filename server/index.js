import { startFromGenesis } from './genesis'
import serve from './serve'

const connectionsDoc = startFromGenesis('genesis.json')
const port = 8080

serve(port, connectionsDoc).on('listening', (event) => {
  console.log(`Simplemerge websocket listening on port ${port}...`)
})
