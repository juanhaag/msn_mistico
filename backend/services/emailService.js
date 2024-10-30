const nodemailer = require('nodemailer');


//Usamos mailtrap como servicio de mail de pruebas
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });
async function sendVerificationEmail(toEmail, verificationLink) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Verifica tu cuenta',
        html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta: <a href="${verificationLink}">Verificar cuenta</a></p>`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
