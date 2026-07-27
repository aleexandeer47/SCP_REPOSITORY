import { Router } from "express";
import {
  getUnitsMeasurement,
  getUnitMeasurement,
  createUnitMeasurement,
  updateUnitMeasurement,
  deleteUnitMeasurement,
} from "../controller/unitsMeasurementController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getUnitsMeasurement);
router.get("/:id", validateObjectId("id"), getUnitMeasurement);
router.post("/", validateFields(["nombre"]), createUnitMeasurement);
router.put("/:id", validateObjectId("id"), validateFields(["nombre"]), updateUnitMeasurement);
router.delete("/:id", validateObjectId("id"), deleteUnitMeasurement);

export default router;
