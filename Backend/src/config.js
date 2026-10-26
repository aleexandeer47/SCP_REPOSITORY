import dotenv from "dotenv";

// Carga las variables de entorno del archivo .env
dotenv.config();

// Configuración general de la aplicación obtenida desde variables de entorno
export const config = {
    // Conexión a la base de datos MongoDB
    db: {
        URI: process.env.DB_URI
    },
    // Clave secreta para tokens JWT
    JWT: {
        secret: process.env.JWT_secret_key,
    },
    // Credenciales de Mailjet para envío de correos electrónicos
    mailjet: {
        api_key: process.env.MAILJET_API_KEY,
        secret_key: process.env.MAILJET_SECRET_KEY,
        sender_email: process.env.MAILJET_SENDER_EMAIL,
        sender_name: process.env.MAILJET_SENDER_NAME || "SCP"
    },
    // Configuración del servicio de almacenamiento Cloudinary
    cloudinary: {
        cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    },
    // Credenciales para la pasarela de pagos Wompi
    wompi: {
        grant_type: process.env.GRANT_TYPE,
        audience: process.env.AUDIENCE,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    },
    // Configuración de los servicios de Inteligencia Artificial (OpenAI GPT-4o-mini)
    ai: {
        openai_api_key: process.env.OPENAI_API_KEY
    }
};
