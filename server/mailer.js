// 📁 server/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPasswordResetEmail(to, token) {
  const link = `${process.env.BASE_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"UniHomes" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recupero password UniHomes",
    html: `
      <h3>Hai richiesto il reset della password</h3>
      <p>Clicca il link per scegliere una nuova password:</p>
      <a href="${link}">${link}</a>
      <br/><br/>
      <small>Se non hai richiesto questa email, ignora questo messaggio.</small>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordResetEmail };
