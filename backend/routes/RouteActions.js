const SQL = require('../sql')
const { formatActions, addGroupsTogether } = require('../utils')

const RouteActions = async (req, res) => {
  try {
    await SQL.initConnection().then()
    const actions = await SQL.getActions()
    const actionGroups = await SQL.getActionsGroup()

    const newUsers = formatActions(actions, addGroupsTogether(actionGroups))

    await SQL.closeConnection()
    res.status(200).send({ data: newUsers })
  } catch (error) {
    console.info(error)
  }
}

module.exports = RouteActions
