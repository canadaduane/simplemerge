import Automerge from 'automerge'
import serve from '../server/serve'
import connect from '../client/connect'

const testReconnectServer = () => {
  let connDoc = Automerge.change(Automerge.init(), doc => { doc.peers = [] })
  const docSet = new Automerge.DocSet()
  docSet.setDoc('connections', connDoc)

  const port = 8089
  let wsServer = serve(port, connDoc)
  console.log('Setting server up...')
  wsServer.on('listening', _ev1 => {
    console.log('Connecting client...')
    let wsClient = connect('localhost', port, docSet)
    wsClient.addEventListener('open', _ev2 => {
      console.log('Client incrementing counter')
      connDoc = Automerge.change(Automerge.init(), doc => { doc.counter = 0 })
      docSet.setDoc('connections', connDoc)

      setTimeout(() => {
        console.log('Shutting server down...')
        wsServer.close()
      }, 500)
    })
  })
}

module.exports = {
  testReconnectServer
}
