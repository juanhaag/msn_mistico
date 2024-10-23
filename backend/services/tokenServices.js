const crypto = require('crypto');
const db = require('../sql/sql.js'); 

const secretKey = process.env.SECRET_KEY;

/**
 * Generar un token único utilizando la secret key
 * @param {string} userEmail - El email del usuario para crear el token personalizado.
 * @returns {string} - El token generado.
 */
function generateToken(userEmail) {
    const tokenData = `${userEmail}:${Date.now()}`;
    const token = crypto.createHmac('sha256', secretKey).update(tokenData).digest('hex');
    return `customAuth-${token}`;
}

/**
 * Guardar el token generado en la tabla users
 * @param {string} token - El token a guardar.
 * @param {string} userEmail - El email del usuario para asociar el token.
 */
async function saveTokenToUser(token, userEmail) {
    const connection = await db.initConnection(); // Inicializa la conexión
    await connection.query('UPDATE users SET token = ? WHERE email = ?', [token, userEmail]);
}

/**
 * Verificar si el token es válido
 * @param {string} token - El token a validar.
 * @param {string} userEmail - El email del usuario para comprobar si coincide.
 * @returns {boolean} - Devuelve true si el token es válido.
 */
function validateToken(token, userEmail) {
    const expectedToken = generateToken(userEmail);
    return token === expectedToken;
}

module.exports = {
    generateToken,
    saveTokenToUser,
    validateToken
};
