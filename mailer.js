// mailer.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

const OUTLOOK_USER = process.env.OUTLOOK_USER;
const OUTLOOK_PASS = process.env.OUTLOOK_PASS;
const OUTLOOK_HOST = process.env.OUTLOOK_HOST || 'smtp-mail.outlook.com';
const OUTLOOK_PORT = Number(process.env.OUTLOOK_PORT || 587);

export const transporter = nodemailer.createTransport({
  host: OUTLOOK_HOST,
  port: OUTLOOK_PORT,
  secure: false, // true si usas 465
  auth: { user: OUTLOOK_USER, pass: OUTLOOK_PASS },
});

/** Email genérico */
export async function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: `"UCB Masters" <${OUTLOOK_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

/** Correo de pago confirmado con reglas incluidas en el HTML */
export async function sendPaymentConfirmed({ name, email, contestName }) {
  const subject = `🎉 Pago confirmado – ${contestName}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;">
      <h2>¡Hola ${name}!</h2>
      <p>✅ Hemos confirmado tu pago para el concurso <b>${contestName}</b>.</p>
      <p>A continuación te compartimos las <b>Reglas de la competencia</b>:</p>
      <ul>
        <li>Presentarse 30 minutos antes del inicio del evento.</li>
        <li>Traer sus propios utensilios básicos de coctelería.</li>
        <li>No está permitido el uso de bebidas alcohólicas externas al evento.</li>
        <li>El jurado evaluará sabor, presentación y originalidad.</li>
        <li>El fallo del jurado es inapelable.</li>
      </ul>
      <p>¡Te deseamos mucho éxito y nos vemos en el escenario! 🍸</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #ccc;">
      <p style="font-size:12px;color:#666">Este correo fue enviado automáticamente por UCB Masters.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
