const SQL = require('../sql')

const RouteGroup = async (req, res) => {
  try {
    const { body } = req
    const { nombre } = body

    if (!nombre) {
      return res.status(400).send({ message: 'nombre no puede estar vacío' })
    }

    await SQL.initConnection().then()
    await SQL.setGroups(nombre)
    await SQL.closeConnection()
    res.status(200).send({ data: 'ok' })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteGroup
