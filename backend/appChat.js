const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const fs = require('fs')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(express.static('public'))

const activeConnections = new Set()

const sendDataOnConected = (ws) => {
  const jsonMessages = JSON.parse(fs.readFileSync('./logs/messages.json'))
  const jsonUsers = JSON.parse(fs.readFileSync('./logs/users.json'))
  ws.send(JSON.stringify({ messages: jsonMessages, usersLogged: jsonUsers }))
}

wss.on('connection', (ws) => {
  console.info('Cliente WebSocket conectado')

  activeConnections.add(ws)
  sendDataOnConected(ws)

  ws.on('message', (res) => {
    const response = JSON.parse(res)
    console.info('response', response)
    if (response.userLeaving) {
      const jsonUsers = JSON.parse(fs.readFileSync('./logs/users.json'))

      const usersFiltered = jsonUsers.filter((user) => {
        return user.userLogged !== response.userLeaving
      })

      const newUsers = [...usersFiltered]
      fs.writeFileSync('./logs/users.json', JSON.stringify(newUsers))
      activeConnections.forEach((connection) => {
        connection.send(JSON.stringify({ userLoggedOut: response.userLeaving }))
      })
      return
    }
    if (response.userLogged) {
      const jsonUsers = JSON.parse(fs.readFileSync('./logs/users.json'))

      // eslint-disable-next-line arrow-body-style
      if (jsonUsers.find((user) => user.userLogged === response.userLogged)) {
        activeConnections.forEach((connection) => {
          connection.send(JSON.stringify({ usersLogged: jsonUsers }))
        })
        return
      }

      const newUsers = [...jsonUsers, response]
      fs.writeFileSync('./logs/users.json', JSON.stringify(newUsers))
      activeConnections.forEach((connection) => {
        connection.send(JSON.stringify({ usersLogged: newUsers }))
      })
      return
    }

    const jsonMessages = JSON.parse(fs.readFileSync('./logs/messages.json'))
    response.id = jsonMessages.length
    const newMessages = [...jsonMessages, response]
    fs.writeFileSync('./logs/messages.json', JSON.stringify(newMessages))
    activeConnections.forEach((connection) => {
      connection.send(JSON.stringify({ messages: newMessages, usersLogged: [] }))
    })
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.info(`Servidor Node.js escuchando en el puerto ${PORT}`)
})
