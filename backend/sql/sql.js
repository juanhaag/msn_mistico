const mysql = require('mysql2/promise')
const database = require('../connection/connection.json')

let connection
let conectionStablished = false

module.exports = {
  initConnection: async () => {
    if (!conectionStablished) {
      connection = await mysql.createConnection(database)
      conectionStablished = true
    }
    return connection
  },
  closeConnection: async () => {
    if (conectionStablished) {
      await connection.end()
      conectionStablished = false
    }
  },
  getUsers: async () => {
    try {
      const [response] = await connection.execute('CALL GetUsers();')
      const [data] = response
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getUserByID: async (idUser) => {
    try {
      const [user] = await connection.execute('CALL GetUserByID(?)', [idUser])
      return user
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getUsersGroup: async () => {
    try {
      const [response] = await connection.execute('CALL GetUsersGroup();')
      const [data] = response
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getActionsGroup: async () => {
    try {
      const [response] = await connection.execute('CALL GetActionsGroup()')
      const [data] = response
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getGroupUsers: async () => {
    try {
      const [response] = await connection.execute('CALL GetGroupUsers()')
      const [data] = response
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getGroups: async () => {
    try {
      const [response] = await connection.execute('CALL GetGroups()')
      const [data] = response
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getGroupsActions: async () => {
    try {
      const [data] = await connection.execute('CALL GetGroupsActions()')
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getActions: async () => {
    try {
      const [response] = await connection.execute('CALL GetActions()')
      const [data] = response
      return data
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  setUser: async (nombre) => {
    try {
      await connection.execute('CALL SetUser(?, @lastId)', [nombre])
      return await connection.execute('SELECT @lastId as lastId')
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  setUserGroups: async (idUser, idGroup) => {
    try {
      await connection.execute('CALL SetUserGroups(?, ?)', [idUser, idGroup])
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  setActionGroups: async (idAction, idGroup) => {
    try {
      await connection.execute('CALL SetActionGroups(?, ?)', [idAction, idGroup])
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  setGroups: async (nombre) => {
    try {
      await connection.execute('CALL SetGroups(?)', [nombre])
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  setGroupsActions: async (idAccion, idGroup) => {
    try {
      await connection.execute('CALL SetGroupsActions(?, ?)', [idAccion, idGroup])
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  setActions: async (nombre) => {
    try {
      await connection.execute('CALL SetActions(?, @lastId)', [nombre])
      return await connection.execute('SELECT @lastId as lastId')
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  register: async (username, password, email, telefono, verifyCode) => {
    try {
      console.log('telefono', typeof telefono)
      console.log('verifyCode', typeof verifyCode)
      console.log('verifyCode', verifyCode)
      await connection.execute('CALL Register(?, ?, ?, ?, ?, @lastId)', [username, password, email, telefono, verifyCode])
      const [[{ lastId }]] = await connection.execute('SELECT @lastId as lastId')
      return lastId
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  userExists: async (username) => {
    try {
      const [[userExists]] = await connection.execute('CALL UserExists(?)', [username])
      return userExists[0]
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  login: async (username, password) => {
    try {
      const [[user]] = await connection.execute('Call GetUserByNameAndPass(?, ?);', [username, password])
      if (user.length > 0) {
        await connection.execute('CALL Session(?, ?)', [user[0].id, 1])
        return user[0]
      }
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  logout: async (id) => {
    try {
      const [user] = await connection.execute('CALL GetUserByID(?)', [id])
      if (user.length > 0) {
        await connection.execute('CALL Session(?, ?)', [id, 0])
        return true
      }
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  admin: async (idUser) => {
    try {
      const [user] = await connection.execute('Call Admin(?)', [idUser])
      return user.length > 0
    } catch (error) {
      console.info('error', error)
      return [{ data: 'error', message: error }]
    }
  },
  getUserByEmail: async (email) => {
    try {
      const [[user]] = await connection.execute('CALL GetUserByEmail(?)', [email])
      if (user.length > 0) {
        return user[0]
      }
      return null
    } catch (error) {
      console.info('error', error)
      return { data: 'error', message: error }
    }
  },
  verifyUser: async (email) => {
    try {
      const [[user]] = await connection.execute('CALL VerifyUser(?)', [email]);
    
      if (user && user.length > 0) {
        return user[0]; 
      }
      return null; 
    } catch (error) {
      console.info('Error en verifyUser:', error);
      return { data: 'error', message: error.message }; 
    }
  },
  verifyCode: async (idUser) => {
    try {
      await connection.execute('UPDATE users SET verifiedCode = 1 WHERE id = ?', [idUser])
      await connection.execute('UPDATE users SET verifyCode = NULL WHERE id = ?', [idUser])
    } catch (error) {
      console.info('Error en verifyCode:', error);
      return { data: 'error', message: error.message }; 
    }
  },
}
