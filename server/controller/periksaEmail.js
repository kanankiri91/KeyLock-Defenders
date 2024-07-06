import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  const apiKey = process.env.HIBP_API_KEY;
  const userAgent = process.env.USER_AGENT;

  try {
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
      headers: {
        'hibp-api-key': apiKey,
        'user-agent': userAgent,
      },
    });

    if (response.status === 200) {
      return res.status(200).json({
        message: 'Email anda telah bocor!',
        data: response.data,
      });
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(200).json({
          message: 'Email anda aman',
        });
      } else {
        return res.status(error.response.status).json({
          message: 'Error',
          error: error.response.data,
        });
      }
    } else {
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
};
