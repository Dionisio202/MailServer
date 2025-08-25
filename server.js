// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sendPaymentConfirmed, sendRegistrationReceived } from './mailer.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
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
app.use(express.json());

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


//get file 

app.get('/download/reglas', (req, res) => {
  const filePath = path.join(__dirname, 'files', 'Reglas_UCB_Masters.zip');

  res.download(filePath, 'UBC_Masters_2025.zip', (err) => {
    if (err) {
      console.error('Error enviando ZIP:', err);
      if (!res.headersSent) {
        res.status(404).json({ ok: false, error: 'FILE_NOT_FOUND' });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Mailer corriendo en http://localhost:${PORT}`)
);
