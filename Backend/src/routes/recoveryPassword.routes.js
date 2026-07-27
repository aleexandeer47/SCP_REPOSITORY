import { Router } from "express";
import recoveryPasswordController from "../controller/recoveryPasswordController.js";

const router = Router();

/*
  Rutas para la Recuperación de Contraseña.
  Este flujo consta de tres pasos: solicitar un código por correo, verificar que el código
  sea correcto y finalmente establecer la nueva contraseña.
*/

// POST: Envía un correo con el código de verificación si la cuenta existe.
router.post("/requestCode", recoveryPasswordController.requestCode);

// POST: Valida si el código ingresado coincide con el enviado y aún está vigente.
router.post("/verifyCode", recoveryPasswordController.verifyCode);

// POST: Permite establecer una nueva contraseña una vez superados los pasos anteriores.
router.post("/newPassword", recoveryPasswordController.newPassword);

export default router;
