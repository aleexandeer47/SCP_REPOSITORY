import { Router } from "express";
import {
  getPartidas,
  getPartida,
  createPartida,
  updatePartida,
  deletePartida,
} from "../controller/partidasController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getPartidas);
router.get("/:id", validateObjectId("id"), getPartida);
router.post(
  "/",
  validateFields(["nombre_actividad", "unidad_medida", "codigo_e"]),
  createPartida
);
router.put(
  "/:id",
  validateObjectId("id"),
  validateFields(["nombre_actividad", "unidad_medida", "codigo_e"]),
  updatePartida
);
router.delete("/:id", validateObjectId("id"), deletePartida);

export default router;
