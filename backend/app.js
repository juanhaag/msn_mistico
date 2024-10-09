const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 8080
const {
  RouteAction,
  RouteActions,
  RouteGroup,
  RouteGroups,
  RouteUser,
  RouteUsers,
  RouteUserId,
  RouteRegister,
  RouteLogin,
  RouteLogout
} = require('./routes')

app.use(cors())
app.use(express.json())

app.get('/user/:idUser', RouteUserId)
app.get('/users', RouteUsers)
app.get('/groups', RouteGroups)
app.get('/actions', RouteActions)
app.post('/actions', RouteAction)
app.post('/groups', RouteGroup)
app.post('/users', RouteUser)
app.post('/register', RouteRegister)
app.post('/login', RouteLogin)
app.delete('/logout', RouteLogout)

app.listen(PORT, () => {
  console.info(`Your app is listening in http://localhost:${PORT}`)
})
