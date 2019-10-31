import Automerge from 'automerge'
import Server from '../server/Server'
import connect from '../client/connect'

const testReconnectServer = () => {
  let connDoc = Automerge.change(Automerge.init(), doc => { doc.peers = [] })

  console.log('Setting up server (instance-1)...')
  const port = 8089

  // Set up server
  let server = new Server(connDoc)
  server.listen(port).on('listening', _ev1 => {

    console.log('Connecting client...')
    let clientDocSet = new Automerge.DocSet()
    let wsClient = connect('localhost', port, clientDocSet)

    const increment = () => {
      let doc = clientDocSet.getDoc('example')
      if (doc) {
        doc = Automerge.change(doc, doc => { doc.counter = doc.counter + 1 })
      } else {
        doc = Automerge.change(Automerge.init(), doc => { doc.counter = 0 })
      }
      clientDocSet.setDoc('example', doc)
    }

    wsClient.addEventListener('open', _ev2 => {
      console.log('Client incrementing counter')
      increment()
      increment()

      wsServer.on('close', _ev3 => {
        console.log('Server shut down. Restarting...')
        let connDoc2 = Automerge.change(Automerge.init(), doc => { doc.peers = [] })
        let [wsServer2, serverDocSet2] = listen(port, connDoc2)
        wsServer2.on('listening', _ev4 => {
          console.log('Reconnecting client...')
          wsClient = connect('localhost', port, clientDocSet)

          wsClient.addEventListener('open', _ev5 => {
            setTimeout(() => {
              console.log('Shutting server down...')
              wsServer2.close()
            }, 500)
          })
        })
      })

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
