async function delay (millis) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millis)
  })
}

module.exports = delay
