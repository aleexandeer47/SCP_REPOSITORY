import { config } from "../config.js";

// Envía un correo usando la API HTTP de Mailjet (v3.1).
// Se usa HTTP en lugar de SMTP porque Render bloquea los puertos SMTP salientes,
// lo que provocaba que las peticiones se quedaran colgadas.
export const sendMail = async ({ to, subject, html }) => {
  const { api_key, secret_key, sender_email, sender_name } = config.mailjet;

  if (!api_key || !secret_key || !sender_email) {
    throw new Error("Faltan las variables de entorno de Mailjet");
  }

  const auth = Buffer.from(`${api_key}:${secret_key}`).toString("base64");

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: sender_email, Name: sender_name },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
    // Evita que la petición se quede cargando indefinidamente
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Mailjet respondió ${response.status}: ${detail}`);
  }

  return response.json();
};
