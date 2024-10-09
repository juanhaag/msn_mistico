const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 8000

app.use(express.static(path.join(`${__dirname}/public`)))

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public`, 'index.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public`, 'login.html'))
})

app.get('/users', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public`, 'users.html'))
})

app.get('/groups', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public`, 'groups.html'))
})

app.get('/actions', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public`, 'actions.html'))
})

app.get('/chat', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public`, 'chat.html'))
})

app.listen(port, () => {
  console.info(`Server listening on server http://localhost:${port}`)
})
