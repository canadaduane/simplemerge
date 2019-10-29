import Automerge from 'automerge'
import React from 'react'
import ReactDOM from 'react-dom'

import Connection from '../common/connection'

let ws
let conn
const docSet = new Automerge.DocSet()

const incrementExampleCounter = () => {
  let doc = docSet.getDoc('example')
  if (doc) {
    doc = Automerge.change(doc, doc => { doc.counter = doc.counter + 1 })
  } else {
    doc = Automerge.change(Automerge.init(), doc => { doc.counter = 0 })
  }
  docSet.setDoc('example', doc)
}

function connect (docSet) {
  ws = new window.WebSocket('ws://localhost:8080')

  ws.addEventListener('open', event => {
    console.log('opened websocket', event)
    conn = new Connection(Automerge, docSet, ws)
  })

  ws.addEventListener('close', event => {
    if (conn) conn.close()
    ws = null
    conn = null
    console.log('closed websocket', event)
  })

  // Listen for messages
  ws.addEventListener('message', event => {
    if (conn) conn.receiveMsg(event.data)
  })
}

/**
 * Regularly check if the websocket connection has been lost, and reconnect if necessary
 */
setInterval(() => {
  if (!ws || ws.readyState === window.WebSocket.CLOSED) {
    console.log('attempting to re-establish socket connection...')
    connect(docSet)
  }
}, 2500)

class App extends React.Component {
  componentDidMount () {
    this.props.docSet.registerHandler(this.handleChange.bind(this))
  }

  handleChange (docId, doc) {
    this.setState({
      [docId]: doc
    })
  }

  render () {
    const example = (this.state && this.state.example) || {}
    return (
      <div>
        <div>App mounted.</div>
        <div style={{ marginTop: '15px', fontSize: '24px', fontWeight: 'bold' }}>
          Count: {example.counter}
        </div>
        <div>
          <button onClick={incrementExampleCounter}>Add One</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App docSet={docSet} />, document.getElementById('root'))
