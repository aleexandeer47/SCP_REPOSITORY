import { Router } from "express";
import {
  getMaterialsEquipment,
  getMaterialEquipment,
  createMaterialEquipment,
  updateMaterialEquipment,
  deleteMaterialEquipment,
} from "../controller/materialsEquipmentController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getMaterialsEquipment);
router.get("/:id", validateObjectId("id"), getMaterialEquipment);
router.post(
  "/",
  validateFields(["descripcion", "codigo_cm", "codigo_e"]),
  createMaterialEquipment
);
router.put(
  "/:id",
  validateObjectId("id"),
  validateFields(["descripcion", "codigo_cm", "codigo_e"]),
  updateMaterialEquipment
);
router.delete("/:id", validateObjectId("id"), deleteMaterialEquipment);

export default router;
