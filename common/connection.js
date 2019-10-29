// import Automerge from 'automerge'

class Connection {
  constructor (Automerge, docSet, ws) {
    this.ws = ws
    this.automerge = new Automerge.Connection(docSet, msg => this.sendMsg(msg))
    this.automerge.open()
  }

  receiveMsg (msgString) {
    let msg
    try {
      msg = JSON.parse(msgString)
    } catch (e) {
      console.error(e)
      return false
    }
    this.automerge.receiveMsg(msg)
    return true
  }

  sendMsg (msg) {
    if (!this.ws) return
    const msgString = JSON.stringify(msg)
    this.ws.send(msgString)
  }

  close () {
    if (!this.ws) return
    this.ws.close()
    this.ws = null
  }
}

module.exports = Connection