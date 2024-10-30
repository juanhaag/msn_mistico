const SQL = require('../sql');
const { generateToken, saveTokenToUser } = require('../services/tokenServices');
const sendVerificationEmail = require('../services/emailService'); 

const RouteRegister = async (req, res) => {
  try {
    const { body } = req;
    const { username, password, email } = body;

    if (!password.match(/^(?=.*\d).{4,8}$/)) {
      res.status(400).send({
        message: 'Password must be between 4 and 8 digits long and include at least one numeric digit.'
      });
      return;
    }

    await SQL.initConnection();

    const userExists = await SQL.userExists(username);
    if (userExists) {
      await SQL.closeConnection();
      res.status(403).send({ data: { message: 'Usuario ya existe' } });
      return;
    }

    const idUser = await SQL.register(username, password, email);

    const token = generateToken(email);
    console.log('Token:', token);
    
    await saveTokenToUser(token, email);

    const verificationLink = `http://localhost:${process.env.PORT}/verify?token=${token}&email=${encodeURIComponent(email)}`;
    await sendVerificationEmail(email, verificationLink);

    await SQL.closeConnection();

    res.status(200).send({ data: { idUser, message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.' } });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).send({ data: { message: 'Internal server error' } });
  }
};

module.exports = RouteRegister;
