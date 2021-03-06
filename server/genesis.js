import Automerge from 'automerge'
import fs from 'fs'

const makeGenesisDoc = (genesisFile) => {
  const genDoc = Automerge.change(Automerge.init(), doc => { doc.peers = [] })
  fs.writeFileSync(genesisFile, Automerge.save(genDoc))
  return genDoc
}

const loadGenesisDoc = (genesisFile) => {
  return Automerge.load(fs.readFileSync(genesisFile))
}

const startFromGenesisDoc = (genesisFile) => {
  let connectionsDoc

  try {
    connectionsDoc = loadGenesisDoc(genesisFile)
  } catch (e) {
    connectionsDoc = makeGenesisDoc(genesisFile)
  }

  return connectionsDoc
}

module.exports = {
  startFromGenesisDoc,
  makeGenesisDoc,
  loadGenesisDoc
}
