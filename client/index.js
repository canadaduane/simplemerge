import Automerge from 'automerge'

import Connection from '../common/connection'

const ws = new WebSocket('ws://localhost:8080')
const docSet = new Automerge.DocSet()
const conn = new Connection(Automerge, docSet, ws)

docSet.registerHandler((docId, doc) => {
  console.log(`[${docId}] ${JSON.stringify(doc)}`)
})

// Make a change to the document every 3 seconds
setInterval(() => {
  let doc = docSet.getDoc('example')
  console.log('example doc', doc)
  if (doc) {
    doc = Automerge.change(doc, doc => doc.counter = doc.counter + 1)
  } else {
    doc = Automerge.change(Automerge.init(), doc => doc.counter = 0)
  }
  docSet.setDoc('example', doc)
}, 3000) 

// Connection opened
// ws.addEventListener('open', function (event) {
//     ws.send("Hello Server!\nOk");
// });

// Listen for messages
ws.addEventListener('message', function (event) {
  const envelope = JSON.parse(event.data)
  console.log('envelope', envelope)
  conn.receiveMsg(event.data)
});
