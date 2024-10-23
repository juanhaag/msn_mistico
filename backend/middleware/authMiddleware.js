const db = require('../db');
const { validateToken } = require('../services/tokenService');

async function authMiddleware(req, res, next) {
    const token = req.cookies.authToken || req.query.token;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    const connection = await db.initConnection();
    const [result] = await connection.query('SELECT email, emailVerified FROM users WHERE token = ?', [token]);

    if (result.length === 0) {
        return res.status(401).send('Invalid or expired token');
    }

    const userEmail = result[0].email;
    const emailVerified = result[0].emailVerified;

    if (!emailVerified) {
        return res.status(403).send('Email not verified');
    }

    if (!validateToken(token, userEmail)) {
        return res.status(401).send('Invalid token');
    }

    next();
}

module.exports = authMiddleware;
