const SQL = require('../sql')
const { formatGroups, addUsersTogether } = require('../utils')

const RouteGroups = async (req, res) => {
  try {
    await SQL.initConnection().then()
    const groups = await SQL.getGroups()
    const groupsUsers = await SQL.getGroupUsers()

    newGroups = formatGroups(groups, addUsersTogether(groupsUsers))

    await SQL.closeConnection()
    res.status(200).send({ data: newGroups })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteGroups
