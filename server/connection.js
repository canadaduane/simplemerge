const Automerge = require('automerge')

class Connection {
  constructor (docSet, ws) {
    this.ws = ws
    this.automerge = new Automerge.Connection(docSet, msg => this.sendMsg(msg))
    this.automerge.open()
  }

  receiveData (data) {
    const msg = JSON.parse(data)
    this.automerge.receiveMsg(msg)
  }

  sendMsg (msg) {
    if (!this.ws) return
    this.ws.send(msg)
  }

  close () {
    if (!this.ws) return
    this.ws.close()
    this.ws = null
  }
}

module.exports = Connection