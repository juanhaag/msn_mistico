const express = require('express')
const cors = require('cors')
require('dotenv').config()
const authMiddleware = require('./middleware/authMiddleware')
const app = express()
const PORT = 8081
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
  RouteLogout,
  RouteVerify
} = require('./routes')

app.use(cors())
app.use(express.json())

app.get('/user/:idUser',authMiddleware, RouteUserId)
app.get('/users',authMiddleware, RouteUsers)
app.get('/groups',authMiddleware, RouteGroups)
app.get('/actions',authMiddleware, RouteActions)
app.post('/actions',authMiddleware, RouteAction)
app.post('/groups',authMiddleware, RouteGroup)
app.post('/users',authMiddleware, RouteUser)
app.delete('/logout',authMiddleware, RouteLogout)

app.post('/register', RouteRegister)
app.get('/verify', RouteVerify)
app.post('/login', RouteLogin)

app.listen(8081, () => {
  console.info(`Your app is listening in http://localhost:${PORT}`)
})
