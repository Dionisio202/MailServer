// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sendPaymentConfirmed } from './mailer.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'https://grupounabestiacocktails.vercel.app'] }));
app.use(express.json());

// Endpoint: el admin lo llama cuando marca pago confirmado
app.post('/api/mails/payment-confirmed', async (req, res) => {
  const { authorization } = req.headers;

  if (authorization !== `Bearer ${process.env.MAILER_API_KEY}`) {
    return res.status(403).json({ ok: false, error: 'UNAUTHORIZED' });
  }

  const { name, email, contestName } = req.body;
  if (!name || !email || !contestName) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
  }

  try {
    const info = await sendPaymentConfirmed({ name, email, contestName });
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'SEND_FAILED' });
  }
});


app.listen(3001, () => console.log('Mailer corriendo en http://localhost:3001'));
