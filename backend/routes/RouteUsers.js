const SQL = require('../sql')
const { formatUsers, addGroupsTogether } = require('../utils')

const RouteUsers = async (req, res) => {
  try {
    await SQL.initConnection().then()
    const users = await SQL.getUsers()
    const usersGroups = await SQL.getUsersGroup()

    const newUsers = formatUsers(users, addGroupsTogether(usersGroups))

    await SQL.closeConnection()
    res.status(200).send({ data: newUsers })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteUsers
