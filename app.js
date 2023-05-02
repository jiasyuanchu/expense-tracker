const express = require('express')
const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  res.send('hello world!')
})

app.listen(3000, () => {
  console.log(`this is running on http://localhost:${PORT}`)
})