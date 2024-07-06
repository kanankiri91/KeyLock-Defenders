// server/utils/sendWhatsappMessage.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendWhatsappMessage(to, messageText) {
  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // Nomor WhatsApp Twilio
      body: messageText,
      to: `whatsapp:${to}`,
    });
    console.log('Pesan WhatsApp berhasil dikirim:', response.sid);
  } catch (error) {
    console.error('Terjadi kesalahan saat mengirim pesan WhatsApp:', error);
  }
}

export default sendWhatsappMessage;
