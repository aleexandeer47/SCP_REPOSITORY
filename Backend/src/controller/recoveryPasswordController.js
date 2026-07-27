import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import HTMLRecoveryEmail from "../utils/SendMailRecoveryPasswords.js";
import { config } from "../config.js";
import Admin from "../models/AdminModel.js";
import { checkRequired, checkEmail, checkLength, getFirstError } from "../utils/Validator.js";

// Este controlador gestiona el restablecimiento de contraseñas olvidadas para los usuarios de SCP.
// Envía un código aleatorio por correo, verifica que coincida usando una cookie cifrada temporal,
// y si el código es correcto, permite guardar una nueva contraseña encriptada en la cuenta correspondiente.
const recoveryPasswordController = {};

// Solicitar código de recuperación de contraseña
// Busca la cuenta del usuario por su correo electrónico. Si la encuentra, genera un código hexadecimal
// de 6 dígitos, firma un token temporal (con 15 min de vigencia), lo inyecta en una cookie segura
// y le envía el código al correo del usuario usando nodemailer.
recoveryPasswordController.requestCode = async (req, res) => {
  try {
    const { email } = req.body;

    const validationError = getFirstError([
      checkRequired(email, "correo electrónico"),
      checkEmail(email, "correo electrónico"),
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const emailTrimmed = email.trim().toLowerCase();

    const userFound = await Admin.findOne({ email: emailTrimmed });
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar un código aleatorio seguro
    const randomCode = crypto.randomBytes(3).toString("hex");

    const token = jsonwebtoken.sign(
      { email: emailTrimmed, randomCode, verified: false },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    // Configurar el transporte de correo usando Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: emailTrimmed,
      subject: "Código de recuperación de contraseña",
      html: HTMLRecoveryEmail(randomCode),
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al enviar correo" });
      }
      return res.status(200).json({ message: "email sent" });
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verificar código de recuperación de contraseña
// Revisa si el código ingresado por el usuario coincide con el código almacenado en el token de la cookie
// de recuperación. Si coincide, emite un nuevo token temporal marcando 'verified: true' para habilitar el
// siguiente paso.
recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    const validationError = checkRequired(code, "código de verificación");
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const token = req.cookies.recoveryCookie;
    if (!token) {
      return res.status(400).json({ message: "No recovery session active" });
    }
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // Código correcto, actualizamos la cookie indicando que ya fue verificado
    const newToken = jsonwebtoken.sign(
      { email: decoded.email, verified: true },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Establecer nueva contraseña
// Cambia la contraseña definitiva del usuario. Valida que el token de la cookie de recuperación tenga
// la marca 'verified: true', encripta la nueva clave, la guarda en el modelo y limpia la cookie de recuperación.
recoveryPasswordController.newPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    const validationError = getFirstError([
      checkRequired(newPassword, "nueva contraseña"),
      checkLength(newPassword, "nueva contraseña", 6, 50),
      checkRequired(confirmNewPassword, "confirmar nueva contraseña"),
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const token = req.cookies.recoveryCookie;
    if (!token) {
      return res.status(400).json({ message: "No recovery session active" });
    }
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Asegurarse de que el usuario haya verificado el código previamente
    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await Admin.findOneAndUpdate({ email: decoded.email }, { contrasena: passwordHash });

    // Borramos la cookie de recuperación para que no se pueda reutilizar
    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default recoveryPasswordController;
