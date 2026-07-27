import { Router } from "express";
import {
  getIndirectCosts,
  getIndirectCost,
  createIndirectCost,
  updateIndirectCost,
  deleteIndirectCost,
} from "../controller/indirectCostsController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getIndirectCosts);
router.get("/:id", validateObjectId("id"), getIndirectCost);
router.post("/", validateFields(["precio", "codigo_m", "codigo_e"]), createIndirectCost);
router.put(
  "/:id",
  validateObjectId("id"),
  validateFields(["precio", "codigo_m", "codigo_e"]),
  updateIndirectCost
);
router.delete("/:id", validateObjectId("id"), deleteIndirectCost);

export default router;
