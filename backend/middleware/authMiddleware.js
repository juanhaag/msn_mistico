const db = require('../sql/sql');
const { validateToken } = require('../services/tokenServices');

async function authMiddleware(req, res, next) {
    const token = req.body.authToken || req.query.token;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    const connection = await db.initConnection();
    const [result] = await connection.query('SELECT email, email_verified FROM users WHERE token = ?', [token]);

    if (result.length === 0) {
        return res.status(401).send('Invalid or expired token');
    }

    const userEmail = result[0].email;
    const emailVerified = result[0].email_verified;  

    if (!emailVerified) {
        return res.status(403).send('Email not verified');
    }

    if (!validateToken(token, userEmail)) {
        return res.status(401).send('Invalid token');
    }

    next();
}

module.exports = authMiddleware;
