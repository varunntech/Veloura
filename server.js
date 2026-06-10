import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const BREVO_API_KEY = process.env.VITE_BREVO_API_KEY;
const SENDER_EMAIL = "varunrajput841428@gmail.com";

app.post('/api/send-email', async (req, res) => {
  const { toEmail, toName, subject, htmlContent } = req.body;

  if (!BREVO_API_KEY || BREVO_API_KEY === 'YOUR_BREVO_API_KEY_HERE') {
    console.error("Brevo API Key is missing or not configured in .env");
    return res.status(500).json({ error: "Brevo SMTP API key is not configured in .env file." });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: "Veloura Luxury Fashion",
          email: SENDER_EMAIL
        },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error:", data);
      return res.status(response.status).json(data);
    }

    console.log(`Email successfully sent to ${toEmail}`);
    res.status(200).json({ success: true, messageId: data.messageId });
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`--------------------------------------------------`);
  console.log(`Email Proxy Server is running on http://localhost:${PORT}`);
  console.log(`Vite App will communicate through this server.`);
  console.log(`--------------------------------------------------`);
});
