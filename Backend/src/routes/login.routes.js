import { Router } from "express";
import loginController from "../controller/loginController.js";
import { validateFields } from "../utils/validators.js";

const router = Router();

/*
  Rutas para el Inicio de Sesión.
  Contiene los endpoints necesarios para validar las credenciales de un usuario y
  para validar si su sesión actual sigue activa y vigente.
*/

// POST: Autentica al usuario con su usuario/contraseña y genera su cookie de sesión.
router.post("/", validateFields(["usuario", "contrasena"]), loginController.login);

// GET: Verifica si el token guardado en la cookie es válido (para mantener la sesión en el frontend).
router.get("/verify", loginController.verify);

export default router;
