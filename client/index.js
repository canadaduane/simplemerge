import Automerge from 'automerge'

import Connection from '../common/connection'

const ws = new WebSocket('ws://localhost:8080')
const docSet = new Automerge.DocSet()
const conn = new Connection(Automerge, docSet, ws)

// Make a change to the document every 3 seconds
setInterval(() => {
  let doc = docSet.getDoc('connections')
  console.log('example doc', doc)
  if (doc) {
    doc = Automerge.change(doc, doc => {
      doc.clientNum = (doc.clientNum || 0) + 1
    })
    docSet.setDoc('example', doc)
  }
}, 3000) 

// Connection opened
// ws.addEventListener('open', function (event) {
//     ws.send("Hello Server!\nOk");
// });

// Listen for messages
ws.addEventListener('message', function (event) {
  const envelope = JSON.parse(event.data);
  console.log('envelope', envelope);
});
