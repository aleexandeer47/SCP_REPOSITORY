import { Router } from "express";
import {
  getUnitCosts,
  getUnitCost,
  createUnitCost,
  updateUnitCost,
  deleteUnitCost,
} from "../controller/unitCostsController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

const requiredFields = [
  "cantidad_material",
  "calculo_precioU",
  "total",
  "codigo_m",
  "codigo_p",
  "codigo_ci",
  "codigo_e",
  "codigo_pu",
  "codigo_proyecto",
  "codigo_cat",
];

router.get("/", getUnitCosts);
router.get("/:id", validateObjectId("id"), getUnitCost);
router.post("/", validateFields(requiredFields), createUnitCost);
router.put("/:id", validateObjectId("id"), validateFields(requiredFields), updateUnitCost);
router.delete("/:id", validateObjectId("id"), deleteUnitCost);

export default router;
