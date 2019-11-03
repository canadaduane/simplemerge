import Automerge from 'automerge'
import WebSocket from 'isomorphic-ws'

import Connection from '../common/connection'

class Client {
  constructor ({ host, port, docSet }) {
    this.host = host
    this.port = port
    this.docSet = docSet || new Automerge.DocSet()
  }

  createWebSocket () {
    this.websocket = new WebSocket('ws://' + this.host + ':' + this.port)
  }

  isConnected () {
    return (this.websocket && this.websocket.readyState !== WebSocket.CLOSED)
  }

  async connect () {
    this.createWebSocket()

    // Clean things up when the websocket closes
    this.websocket.addEventListener('close', event => {
      console.log("CLOSE")
      if (this.connection) {
        this.connection.close()
      }
      this.websocket = null
      this.connection = null
      console.log('closed client websocket')
    })

    // Listen for messages
    this.websocket.addEventListener('message', event => {
      console.log('message', event.data)
      if (this.connection) {
        this.connection.receiveMsg(event.data)
      }
    })

    return new Promise((resolve, reject) => {
      this.websocket.addEventListener('error', event => {
        reject(event.target)
      })

      this.websocket.addEventListener('open', event => {
        this.connection = new Connection(this.docSet, this.websocket)
        console.log('opened client websocket')
        resolve()
      })
    })
  }

  async disconnect () {
    return new Promise((resolve, reject) => {
      this.connection.close()
      resolve()
    })
  }
}

module.exports = Client
