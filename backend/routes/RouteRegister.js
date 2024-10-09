const SQL = require('../sql')

const RouteRegister = async (req, res) => {
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
    const userExists = await SQL.userExists(username)
    if (userExists) {
      await SQL.closeConnection()
      res.status(403).send({ data: { message: 'Usuario ya existe' } })
      return
    }

    const idUser = await SQL.register(username, password)
    const isAdmin = await SQL.admin(idUser)
    await SQL.closeConnection()
    res.status(200).send({ data: { isAdmin, idUser } })
  } catch (error) {
    console.info(error)
    res.status(500).send({ data: { message: 'Internal server error' } })
  }
}

module.exports = RouteRegister
