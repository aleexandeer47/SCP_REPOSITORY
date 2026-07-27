import { Router } from "express";
import adminController from "../controller/adminController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validateObjectId, validateFields } from "../utils/validators.js";
import upload from "../utils/CloudinaryConfig.js";

const router = Router();

router.use(authRequired, isAdmin);

router.get("/", adminController.getUsers);
router.get("/:id", validateObjectId("id"), adminController.getUser);
router.post(
  "/",
  upload.single("image_url"),
  validateFields(["usuario", "contrasena", "email", "codigo_e"]),
  adminController.register
);
router.put("/:id", validateObjectId("id"), upload.single("image_url"), adminController.updateUser);
router.delete("/:id", validateObjectId("id"), adminController.deleteUser);

export default router;
