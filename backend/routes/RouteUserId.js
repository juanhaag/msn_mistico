const SQL = require('../sql')

const RouteUserId = async (req, res) => {
  try {
    await SQL.initConnection().then()
    const { idUser } = req.params
    const user = await SQL.getUserByID(idUser)

    await SQL.closeConnection()
    res.status(200).send({ data: user })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteUserId
