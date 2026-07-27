import jwt from "jsonwebtoken";
import { config } from "../config.js";

// Verifica que la petición traiga un token válido en la cookie "authCookie"
export const authRequired = (req, res, next) => {
  const { authCookie } = req.cookies;

  if (!authCookie) {
    return res.status(401).json({ message: "No autorizado, token no proporcionado" });
  }

  jwt.verify(authCookie, config.JWT.secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
    req.user = decoded;
    next();
  });
};
