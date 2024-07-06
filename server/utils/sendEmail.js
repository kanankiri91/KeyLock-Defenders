import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, messageText) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: messageText,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email berhasil dikirim:', info.messageId);
  } catch (error) {
    console.error('Terjadi kesalahan saat mengirim email:', error);
  }
}

export default sendEmail;
