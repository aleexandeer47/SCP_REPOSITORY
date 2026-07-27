import { Router } from "express";
import logoutController from "../controller/logoutController.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

/*
  Rutas para el Cierre de Sesión (Logout).
  Se encarga de limpiar la cookie de sesión (authCookie) para desconectar al usuario.
*/

// POST: Realiza el cierre de sesión destruyendo la cookie de autenticación.
router.post("/", authRequired, logoutController.logout);

export default router;
