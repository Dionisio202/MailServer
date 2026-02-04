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

// (Opcional) Verifica conexión SMTP al arrancar
transporter.verify().then(
  () => console.log('SMTP listo ✅'),
  (err) => console.error('SMTP error ❌', err)
);

/** Email genérico */
export async function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: `"UBC Masters" <${OUTLOOK_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

/** Correo de pago confirmado */
export async function sendPaymentConfirmed({ name, email, contestName, rulesUrl, mapsUrl }) {
  const subject = `🏆 Inscripción confirmada - ${contestName}`;

  const DEFAULT_MAPS_URL = 'https://www.google.com/maps/dir/?api=1&destination=-1.3984883,-78.4388232';
  const locationUrl = mapsUrl || DEFAULT_MAPS_URL;

  const text =
`Hola ${name},
Tu pago ha sido procesado exitosamente. Bienvenido a ${contestName}.

Lugar: Quinta Los Juanes - Baños
Ubicación: ${locationUrl}

Fecha: Domingo 22 de Febrero, 2026
${rulesUrl ? `Reglas: ${rulesUrl}` : ''}`.trim();

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inscripción Confirmada</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#0f0f0f;color:#ffffff;">
      <div style="max-width:600px;margin:20px auto;background:linear-gradient(135deg,#1a1a1a 0%,#2d1b00 100%);border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);">
        <div style="background:linear-gradient(90deg,#f59e0b 0%,#ea580c 100%);color:white;padding:35px 20px;text-align:center;border-radius:12px 12px 0 0;position:relative;overflow:hidden;">
          <div style="position:relative;z-index:2;">
            <h1 style="margin:0;font-size:26px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">🏆 UBC Masters of Cocktail</h1>
            <p style="margin:10px 0 0 0;font-size:16px;opacity:0.95;">Baños 2026</p>
            <div style="width:60px;height:3px;background:#ffffff;margin:12px auto;border-radius:2px;"></div>
          </div>
        </div>

        <div style="padding:35px 25px;">
          <h2 style="color:#f59e0b;font-size:22px;margin:0 0 25px 0;">¡Hola ${name}! 👋</h2>

          <div style="background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-left:4px solid #10b981;padding:20px;margin:25px 0;border-radius:8px;">
            <p style="margin:0;color:#34d399;font-size:16px;font-weight:500;text-align:center;">
              ✅ Tu pago ha sido procesado exitosamente, bienvenido a <b>${contestName}</b>.
            </p>
          </div>

          <div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:25px;margin:25px 0;border-left:4px solid #f59e0b;">
            <h3 style="color:#f59e0b;font-size:18px;margin:0 0 15px 0;">📅 Información del evento:</h3>
            <p style="margin:8px 0;color:#d1d5db;font-size:15px;">📍 <strong style="color:#ffffff;">Lugar:</strong> Quinta Los Juanes - Baños</p>

            <div style="text-align:left;margin:14px 0 6px 0;">
              <a href="${locationUrl}" style="display:inline-block;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.35);color:#f59e0b;padding:10px 14px;text-decoration:none;border-radius:8px;font-weight:600;">
                📍 Ver ubicación en Google Maps
              </a>
            </div>

            <p style="margin:8px 0;color:#d1d5db;font-size:15px;">🗓️ <strong style="color:#ffffff;">Fecha:</strong> Domingo 22 de Febrero, 2026</p>
          </div>

          ${rulesUrl ? `
          <div style="text-align:center;margin:30px 0;">
            <a href="${rulesUrl}" style="display:inline-block;background:linear-gradient(90deg,#f59e0b 0%,#ea580c 100%);color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;box-shadow:0 4px 15px rgba(245,158,11,0.3);">
              📋 Ver Reglas del Concurso
            </a>
          </div>` : ''}

          <div style="background:linear-gradient(135deg,#f59e0b20,#ea580c20);border-radius:10px;padding:25px;text-align:center;margin:25px 0;border:1px solid rgba(245,158,11,0.3);">
            <div style="font-size:32px;margin-bottom:10px;">🍸</div>
            <p style="margin:0;color:#f59e0b;font-size:16px;font-weight:600;margin-bottom:8px;">¡Prepárate para brillar!</p>
            <p style="margin:0;color:#d1d5db;font-size:15px;">Te deseamos mucho éxito en la competencia.</p>
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.5);padding:25px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid rgba(245,158,11,0.2);">
          <p style="margin:0 0 10px 0;color:#f59e0b;font-weight:bold;font-size:16px;">Grupo Una Bestia Cocktails</p>
          <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.4;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <div style="margin-top:12px;font-size:18px;">🥂</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, text, html });
}


/** Correo de inscripción recibida (bienvenida) */
export async function sendRegistrationReceived({ name, email, contestName }) {
  const subject = `✅ Inscripción recibida - ${contestName}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Inscripción Recibida</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#0f0f0f;color:#ffffff;">
      <div style="max-width:600px;margin:20px auto;background:linear-gradient(135deg,#1a1a1a 0%,#2d1b00 100%);border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);">
        <div style="background:linear-gradient(90deg,#f59e0b 0%,#ea580c 100%);color:white;padding:35px 20px;text-align:center;border-radius:12px 12px 0 0;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-20px;right:-20px;width:40px;height:40px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
          <div style="position:absolute;bottom:-15px;left:-15px;width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
          <div style="position:relative;z-index:2;">
            <h1 style="margin:0;font-size:26px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">🏆 UBC Masters of Cocktail</h1>
            <p style="margin:10px 0 0 0;font-size:16px;opacity:0.95;">Ambato 2025</p>
            <div style="width:60px;height:3px;background:#ffffff;margin:12px auto;border-radius:2px;"></div>
          </div>
        </div>

        <div style="padding:35px 25px;">
          <h2 style="color:#f59e0b;font-size:22px;margin:0 0 25px 0;">¡Hola ${name}! 👋</h2>

          <div style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.35);border-left:4px solid #3b82f6;padding:18px;border-radius:8px;margin-bottom:22px;">
            <p style="margin:0;color:#93c5fd;font-size:15px;text-align:center;">
              Hemos recibido tu <b>inscripción</b> para <b>${contestName}</b>.
              En breve nos pondremos en contacto por <b>WhatsApp</b> o <b>email</b> para coordinar el <b>pago</b> y asegurar tu cupo.
            </p>
          </div>

          <div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:22px;border-left:4px solid #f59e0b;margin-bottom:22px;">
            <h3 style="color:#f59e0b;font-size:18px;margin:0 0 12px 0;">📋 Reglas generales</h3>
            <ul style="margin:0;padding-left:18px;color:#d1d5db;line-height:1.6;">
              <li>Usar obligatoriamente <b>producto tequila Calaca</b> en su receta.</li>
              <li><b>Enviar a tiempo la receta</b> (según indicaciones que te compartiremos).</li>
              <li>Contarán con <b>15 minutos</b> para hacer su <b>decoración</b>.</li>
              <li>Tendrán <b>6 minutos</b> para preparar <b>3 cócteles</b> en el escenario.</li>
            </ul>
          </div>

          <p style="margin:0;color:#9ca3af;font-size:14px;text-align:center;">
            Si tienes preguntas, responde a este correo y con gusto te ayudamos.
          </p>
        </div>

        <div style="background:rgba(0,0,0,0.5);padding:22px;text-align:center;border-radius:0 0 12px 12px;border-top:1px solid rgba(245,158,11,0.2);">
          <p style="margin:0 0 8px 0;color:#f59e0b;font-weight:bold;font-size:16px;">Grupo Una Bestia Cocktails</p>
          <div style="font-size:18px;">🥂</div>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: email, subject, html });
}
