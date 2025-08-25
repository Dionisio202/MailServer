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
  const subject = `🏆 ¡Inscripción confirmada! - ${contestName}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inscripción Confirmada - UBC Masters</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Arial',sans-serif;background-color:#0f0f0f;color:#ffffff;">
      
      <!-- Container principal -->
      <div style="max-width:650px;margin:0 auto;background:linear-gradient(135deg,#1a1a1a 0%,#2d1b00 100%);">
        
        <!-- Header con gradiente -->
        <div style="background:linear-gradient(90deg,#f59e0b 0%,#ea580c 100%);padding:0;text-align:center;position:relative;overflow:hidden;">
          <!-- Efectos decorativos -->
          <div style="position:absolute;top:-50px;right:-50px;width:100px;height:100px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
          <div style="position:absolute;bottom:-30px;left:-30px;width:60px;height:60px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
          
          <div style="padding:40px 20px;position:relative;z-index:2;">
            <h1 style="margin:0;font-size:28px;font-weight:bold;color:#ffffff;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
              🏆 UCB Masters of Cocktail
            </h1>
            <div style="width:60px;height:3px;background:#ffffff;margin:15px auto;border-radius:2px;"></div>
          </div>
        </div>

        <!-- Contenido principal -->
        <div style="padding:40px 30px;">
          
          <!-- Saludo personalizado -->
          <div style="text-align:center;margin-bottom:35px;">
            <h2 style="margin:0 0 10px 0;font-size:24px;color:#f59e0b;font-weight:600;">
              ¡Hola ${name}! 👋
            </h2>
            <div style="width:80px;height:2px;background:linear-gradient(90deg,#f59e0b,#ea580c);margin:0 auto;border-radius:1px;"></div>
          </div>

          <!-- Mensaje de confirmación -->
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:25px;margin-bottom:30px;text-align:center;">
            <div style="font-size:48px;margin-bottom:15px;">🎉</div>
            <h3 style="margin:0 0 10px 0;color:#f59e0b;font-size:20px;font-weight:600;">
              ¡Inscripción Confirmada!
            </h3>
            <p style="margin:0;font-size:16px;color:#d1d5db;line-height:1.5;">
              Tu pago ha sido procesado exitosamente para <strong style="color:#ffffff;">${contestName}</strong>
            </p>
          </div>

          <!-- Información del evento -->
          <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:25px;margin-bottom:30px;border-left:4px solid #f59e0b;">
            <h3 style="margin:0 0 20px 0;color:#f59e0b;font-size:18px;display:flex;align-items:center;">
              📅 Detalles del Evento
            </h3>
            <div style="display:grid;gap:12px;">
              <div style="display:flex;align-items:center;font-size:14px;">
                <span style="color:#f59e0b;margin-right:10px;font-weight:bold;">📍</span>
                <span style="color:#d1d5db;">Hotel Casa Ambateña, Miraflores - Ambato</span>
              </div>
              <div style="display:flex;align-items:center;font-size:14px;">
                <span style="color:#f59e0b;margin-right:10px;font-weight:bold;">🗓️</span>
                <span style="color:#d1d5db;">9 de Noviembre, 2025</span>
              </div>
              <div style="display:flex;align-items:center;font-size:14px;">
                <span style="color:#f59e0b;margin-right:10px;font-weight:bold;">⏰</span>
                <span style="color:#d1d5db;">Presentarse 30 minutos antes del evento</span>
              </div>
            </div>
          </div>

          <!-- Reglas de la competencia -->
          <div style="margin-bottom:30px;">
            <h3 style="margin:0 0 20px 0;color:#f59e0b;font-size:18px;display:flex;align-items:center;">
              📋 Reglas de la Competencia
            </h3>
            <div style="background:rgba(0,0,0,0.2);border-radius:12px;padding:20px;">
              <div style="display:grid;gap:15px;">
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <span style="background:#f59e0b;color:#000;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;flex-shrink:0;margin-top:2px;">1</span>
                  <span style="color:#d1d5db;font-size:14px;line-height:1.4;">Presentarse <strong>30 minutos antes</strong> del inicio del evento</span>
                </div>
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <span style="background:#f59e0b;color:#000;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;flex-shrink:0;margin-top:2px;">2</span>
                  <span style="color:#d1d5db;font-size:14px;line-height:1.4;">Traer sus propios <strong>utensilios básicos</strong> de coctelería</span>
                </div>
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <span style="background:#f59e0b;color:#000;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;flex-shrink:0;margin-top:2px;">3</span>
                  <span style="color:#d1d5db;font-size:14px;line-height:1.4;">No está permitido el uso de bebidas alcohólicas <strong>externas al evento</strong></span>
                </div>
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <span style="background:#f59e0b;color:#000;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;flex-shrink:0;margin-top:2px;">4</span>
                  <span style="color:#d1d5db;font-size:14px;line-height:1.4;">El jurado evaluará <strong>sabor, presentación y originalidad</strong></span>
                </div>
                <div style="display:flex;align-items:flex-start;gap:12px;">
                  <span style="background:#f59e0b;color:#000;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;flex-shrink:0;margin-top:2px;">5</span>
                  <span style="color:#d1d5db;font-size:14px;line-height:1.4;">El fallo del jurado es <strong>inapelable</strong></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensaje motivacional -->
          <div style="background:linear-gradient(135deg,#f59e0b20,#ea580c20);border-radius:12px;padding:25px;text-align:center;margin-bottom:30px;border:1px solid rgba(245,158,11,0.3);">
            <div style="font-size:36px;margin-bottom:15px;">🍸</div>
            <h3 style="margin:0 0 10px 0;color:#f59e0b;font-size:18px;font-weight:600;">
              ¡Prepárate para brillar!
            </h3>
            <p style="margin:0;color:#d1d5db;font-size:15px;line-height:1.5;">
              Te deseamos mucho éxito en la competencia.<br>
              <strong style="color:#ffffff;">¡Nos vemos en el escenario!</strong>
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background:rgba(0,0,0,0.5);padding:25px 30px;text-align:center;border-top:1px solid rgba(245,158,11,0.2);">
          <div style="margin-bottom:15px;">
            <span style="color:#f59e0b;font-size:18px;font-weight:bold;">Grupo Una Bestia Cocktails</span>
          </div>
          <div style="font-size:12px;color:#9ca3af;line-height:1.4;">
            Este correo fue enviado automáticamente por UCB Masters of Cocktail.<br>
            Si tienes alguna pregunta, no dudes en contactarnos.
          </div>
          <div style="margin-top:15px;font-size:20px;">
            🥂 🍹 🍸
          </div>
        </div>

      </div>
      
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html });
}
