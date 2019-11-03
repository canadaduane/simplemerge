import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import Automerge from 'automerge'

import delay from '../common/delay'
import Client from './Client'

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

const start = async () => {
  const client = new Client({
    host: 'localhost',
    port: 8080
  })

  ReactDOM.render(
    <App docSet={client.docSet} />,
    document.getElementById('root')
  )

  while (true) {
    console.log('checking connection...')
    if (!client.isConnected()) {
      try {
        await client.connect()
      } catch (e) {
        // it's ok
      }
    }
    await delay(500)
  }
}

start()
