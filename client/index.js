import React from 'react'
import ReactDOM from 'react-dom'
import Automerge from 'automerge'

import connect from './connect'

let ws
const docSet = new Automerge.DocSet()

/**
 * Regularly check if the websocket connection has been lost, and reconnect if necessary
 */
setInterval(() => {
  if (!ws || ws.readyState === window.WebSocket.CLOSED) {
    console.log('attempting to re-establish socket connection...')
    ws = connect('localhost', 8080, docSet)
  }
}, 500)

class App extends React.Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleAddOne = this.handleAddOne.bind(this)
  }

  componentDidMount () {
    this.props.docSet.registerHandler(this.handleChange)
  }

  handleChange (docId, doc) {
    this.setState({
      [docId]: doc
    })
  }

  handleAddOne () {
    const docSet = this.props.docSet
    let doc = docSet.getDoc('example')
    if (doc) {
      doc = Automerge.change(doc, doc => { doc.counter = doc.counter + 1 })
    } else {
      doc = Automerge.change(Automerge.init(), doc => { doc.counter = 0 })
    }
    docSet.setDoc('example', doc)
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
          <button onClick={this.handleAddOne}>Add One</button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App docSet={docSet} />, document.getElementById('root'))
