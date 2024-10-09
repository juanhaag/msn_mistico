const SQL = require('../sql')

const RouteAction = async (req, res) => {
  try {
    const { body } = req
    const { nombre, grupos } = body

    if (!nombre) {
      return res.status(400).send({ message: 'nombre no puede estar vacío' })
    }

    await SQL.initConnection().then()
    const [response] = await SQL.setActions(nombre)
    if (grupos.length > 0) {
      const { lastId: insertId } = { ...response[0] }
      grupos.forEach(async (idGrupo) => {
        await SQL.setActionGroups(insertId, idGrupo)
      })
    }
    await SQL.closeConnection()
    res.status(200).send({ data: 'ok' })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteAction
