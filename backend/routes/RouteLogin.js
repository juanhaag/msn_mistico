const SQL = require('../sql')

const RouteLogin = async (req, res) => {
  try {
    const { body } = req
    const { username, password } = body

    if (!password.match(/^(?=.*\d).{4,8}$/)) {
      res
        .status(400)
        .send({ message: 'Password must be between 4 and 8 digits long and include at least one numeric digit.' })
      return
    }

    await SQL.initConnection().then()
    const user = await SQL.login(username, password)
    if (!user) {
      await SQL.closeConnection()
      res.status(403).send({ data: { message: 'Usuario o contraseña son incorrectos' } })
      return
    }

    const isAdmin = await SQL.admin(user.id)
    await SQL.closeConnection()
    res.status(200).send({ data: { isAdmin, idUser: user.id } })
  } catch (error) {
    console.info(error)
    res.status(500).send({ data: { message: 'Internal server error' } })
  }
}

module.exports = RouteLogin
