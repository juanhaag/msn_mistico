const { validateToken } = require('../services/tokenServices');
const SQL = require('../sql');

const verifyAccount = async (req, res) => {
  const { token, email } = req.query;

  try {
    await SQL.initConnection();

    const user = await SQL.getUserByEmail(email);
    if (!user) {
      res.status(404).send({ message: 'Usuario no encontrado' });
      return;
    }

    const isValidToken = validateToken(token, email);
    if (!isValidToken) {
      res.status(400).send({ message: 'Token inválido o caducado' });
      return;
    }

    await SQL.verifyUser(email);

    await SQL.closeConnection();
    //Se podria poner la url del front en una variable de entorno
    res.status(200).redirect('http://localhost:8000/login');
    } catch (error) {
    console.error('Error al verificar la cuenta:', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
};

module.exports = verifyAccount;
