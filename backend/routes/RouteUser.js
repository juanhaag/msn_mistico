const SQL = require('../sql')

const RouteUser = async (req, res) => {
  try {
    const { body } = req
    const { nombre, grupos } = body

    if (!nombre) {
      return res.status(400).send({ message: 'nombre no puede estar vacío' })
    }

    await SQL.initConnection().then()
    const [response] = await SQL.setUser(nombre)
    if (grupos.length > 0) {
      const { lastId: insertId } = { ...response[0] }
      grupos.forEach(async (idGrupo) => {
        await SQL.setUserGroups(insertId, idGrupo)
      })
    }
    await SQL.closeConnection()
    res.status(200).send({ data: 'ok' })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteUser
