import fs from 'fs';
import dataPhishing from '../controller/links.json' assert { type: 'json' };

// Load data URL phishing
const phishingUrls = dataPhishing.urls;

// Fungsi untuk melakukan pengecekan URL
export const checkUrl = (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ message: 'URL tidak ditemukan dalam permintaan' });
    }

    // Cek apakah ada URL phishing yang cocok dengan inputan user
    const isPhishing = phishingUrls.some(phishingUrl => url.includes(phishingUrl));
    
    // Jika ada URL phishing yang cocok, maka URL dianggap phishing
    if (isPhishing) {
        return res.status(200).json({ message: 'URL Anda mengandung phishing' });
    } else {
        return res.status(200).json({ message: 'URL Anda aman' });
    }
};
