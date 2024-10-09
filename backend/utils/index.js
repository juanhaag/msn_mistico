const formatUsers = (users, usersGroups) => {
  const newUsers = [...users]
  newUsers.forEach((usersGrouped) => {
    const foundUsersGroup = usersGroups.find((user) => {
      return usersGrouped.id === user.id
    })
    usersGrouped.groups = foundUsersGroup?.groups
  })

  newUsers.sort((a, b) => {
    return a.id - b.id
  })

  return newUsers
}

const formatActions = (actions, actionsGroups) => {
  const newActions = [...actions]
  newActions.forEach((usersGrouped) => {
    const foundActionsGroup = actionsGroups.find((user) => {
      return usersGrouped.id === user.id
    })
    usersGrouped.groups = foundActionsGroup?.groups
  })

  newActions.sort((a, b) => {
    return a.id - b.id
  })

  return newActions
}

const formatGroups = (groups, groupsUsers) => {
  const newGroups = [...groups]

  newGroups.forEach((groupAction) => {
    const foundGroup = groupsUsers.find((group) => {
      return groupAction.id === group.id
    })
    groupAction.users = foundGroup?.users
  })

  newGroups.sort((a, b) => {
    return a.id - b.id
  })

  return newGroups
}

const addGroupsTogether = (groups) => {
  const newGroups = [...groups]

  groups.forEach((i) => {
    const findSameItem = newGroups.find((auxItem) => {
      return auxItem.id === i.id
    })
    if (findSameItem) {
      if (findSameItem.groups && findSameItem.groups.length > 0) {
        findSameItem.groups.push(i.groupName)
        return
      }
      findSameItem.groups = [i.groupName]
      return
    }
  })

  return newGroups
}

const addUsersTogether = (users) => {
  const newUsers = [...users]

  users.forEach((i) => {
    const findSameItem = newUsers.find((auxItem) => {
      return auxItem.id === i.id
    })
    if (findSameItem) {
      if (findSameItem.users && findSameItem.users.length > 0) {
        findSameItem.users.push(i.username)
        return
      }
      findSameItem.users = [i.username]
      return
    }
  })

  return newUsers
}

module.exports = { formatUsers, formatGroups, addUsersTogether, addGroupsTogether, formatActions }
