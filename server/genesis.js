import Automerge from 'automerge'
import fs from 'fs'

const makeGenesis = (genesisFile) => {
  const genDoc = Automerge.change(Automerge.init(), doc => { doc.peers = [] })
  fs.writeFileSync(genesisFile, Automerge.save(genDoc))
  return genDoc
}

const loadGenesis = (genesisFile) => {
  return Automerge.load(fs.readFileSync(genesisFile))
}

const startFromGenesis = (genesisFile) => {
  let connectionsDoc

  try {
    connectionsDoc = loadGenesis(genesisFile)
  } catch (e) {
    connectionsDoc = makeGenesis(genesisFile)
  }

  return connectionsDoc
}

module.exports = {
  startFromGenesis,
  makeGenesis,
  loadGenesis
}
