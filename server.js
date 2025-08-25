// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sendPaymentConfirmed, sendRegistrationReceived } from './mailer.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://grupounabestiacocktails.vercel.app',
    ],
    methods: ['POST', 'OPTIONS', 'GET'],
  })
);

// Health (opcional)
app.get('/health', (_req, res) => res.json({ ok: true }));

// Preflight CORS (opcional)
app.options('/api/mails/payment-confirmed', (_req, res) => res.sendStatus(204));
app.options('/api/mails/registration-received', (_req, res) => res.sendStatus(204));

// Endpoint: pago confirmado
app.post('/api/mails/payment-confirmed', async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.MAILER_API_KEY}`) {
    return res.status(403).json({ ok: false, error: 'UNAUTHORIZED' });
  }

  const { name, email, contestName, rulesUrl } = req.body || {};
  if (!name || !email || !contestName) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
  }

  try {
    const info = await sendPaymentConfirmed({ name, email, contestName, rulesUrl });
    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Error al enviar el correo (payment-confirmed):', err);
    return res.status(500).json({ ok: false, error: 'SEND_FAILED' });
  }
});

// Endpoint: inscripción recibida
app.post('/api/mails/registration-received', async (req, res) => {
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.MAILER_API_KEY}`) {
    return res.status(403).json({ ok: false, error: 'UNAUTHORIZED' });
  }

  const { name, email, contestName } = req.body || {};
  if (!name || !email || !contestName) {
    return res.status(400).json({ ok: false, error: 'MISSING_FIELDS' });
  }

  try {
    const info = await sendRegistrationReceived({ name, email, contestName });
    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Error al enviar el correo (registration-received):', err);
    return res.status(500).json({ ok: false, error: 'SEND_FAILED' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Mailer corriendo en http://localhost:${PORT}`)
);
