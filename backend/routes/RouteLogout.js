const SQL = require('../sql')

const RouteLogout = async (req, res) => {
  try {
    const { body } = req
    const { idUser } = body

    await SQL.initConnection().then()
    const userExists = await SQL.logout(idUser)
    if (!userExists) {
      await SQL.closeConnection()
      res.status(400).send({ message: 'Hubo un error al desloguear!' })
      return
    }

    await SQL.closeConnection()
    res.status(200).send({ data: 'ok' })
  } catch (error) {
    console.info(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = RouteLogout
