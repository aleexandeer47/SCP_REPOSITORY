import { Router } from "express";
import {
  getUnitPrices,
  getUnitPrice,
  createUnitPrice,
  updateUnitPrice,
  deleteUnitPrice,
} from "../controller/unitPricesController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

const requiredFields = ["precio", "presentacion", "precio_unitario", "codigo_m", "codigo_u"];

router.get("/", getUnitPrices);
router.get("/:id", validateObjectId("id"), getUnitPrice);
router.post("/", validateFields(requiredFields), createUnitPrice);
router.put("/:id", validateObjectId("id"), validateFields(requiredFields), updateUnitPrice);
router.delete("/:id", validateObjectId("id"), deleteUnitPrice);

export default router;
