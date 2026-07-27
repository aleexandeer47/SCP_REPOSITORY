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

// codigo_m / codigo_cat / codigo_pu are conditionally required depending on
// `categoria` (equipo & material need codigo_m, mano_obra needs codigo_cat) —
// enforced in the controller since validateFields can't express that.
const requiredFields = ["categoria", "codigo_p", "unidad", "cantidad", "tarifa"];

router.get("/", getUnitCosts);
router.get("/:id", validateObjectId("id"), getUnitCost);
router.post("/", validateFields(requiredFields), createUnitCost);
router.put("/:id", validateObjectId("id"), validateFields(requiredFields), updateUnitCost);
router.delete("/:id", validateObjectId("id"), deleteUnitCost);

export default router;
