const sendVerificationEmail = require('../services/emailService')
const { saveTokenToUser, generateToken } = require('../services/tokenServices')
const SQL = require('../sql')
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const RouteLogin = async (req, res) => {
  try {
    const { body } = req
    const { username, password, codigoValidacion } = body

    if (!password.match(/^(?=.*\d).{4,8}$/)) {
      res
        .status(400)
        .send({ message: 'Password must be between 4 and 8 digits long and include at least one numeric digit.' })
      return
    }

    await SQL.initConnection().then()
    const userExists = await SQL.userExists(username)
    if (!userExists) {
      await SQL.closeConnection()
      res.status(403).send({ data: { message: 'Usuario no existe' } })
      return
    }
    
    if(!userExists.email_verified && !userExists.token){
      const token = generateToken(userExists.email);
      await saveTokenToUser(token, userExists.email);
      const verificationLink = `http://localhost:${process.env.PORT}/verify?token=${token}&email=${encodeURIComponent(userExists.email)}`;
      await sendVerificationEmail(userExists.email, verificationLink);
      await SQL.closeConnection();
    }

    if(!userExists.email_verified){
      res.status(403).send({ data: { message: 'Usuario no verificado' } })
      return
    }
    
    if(!userExists.verifiedCode){
      if(codigoValidacion !== userExists.verifyCode){
        await client.messages.create({
          body: `Tu código de verificación es: ${userExists.verifyCode}`,
          from: "+1 240 303 3665", // Número de Twilio
          to: userExists.telefono.includes('+') ? userExists.telefono : `+${userExists.telefono}`
        })
        await SQL.closeConnection()
        res.status(401).send({ data: { message: 'Ingrese código de validación' } })
        return
      }
      await SQL.verifyCode(userExists.id)
    }

    const user = await SQL.login(username, password)
    if (!user) {
      await SQL.closeConnection()
      res.status(403).send({ data: { message: 'Usuario o contraseña son incorrectos' } })
      return
    }

    const isAdmin = await SQL.admin(user.id)
    await SQL.closeConnection()
    res.status(200).send({ data: { isAdmin, idUser: user.id, authToken:user.token } })
  } catch (error) {
    console.info(error)
    res.status(500).send({ data: { message: 'Internal server error' } })
  }
}

module.exports = RouteLogin
