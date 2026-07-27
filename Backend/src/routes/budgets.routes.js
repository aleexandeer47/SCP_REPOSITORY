import { Router } from "express";
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controller/budgetsController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

const requiredFields = ["total", "total_iva", "codigo_proyecto", "codigo_e", "codigo_cu"];

router.get("/", getBudgets);
router.get("/:id", validateObjectId("id"), getBudget);
router.post("/", validateFields(requiredFields), createBudget);
router.put("/:id", validateObjectId("id"), validateFields(requiredFields), updateBudget);
router.delete("/:id", validateObjectId("id"), deleteBudget);

export default router;
