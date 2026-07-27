import { Router } from "express";
import {
  getLaborCategories,
  getLaborCategory,
  createLaborCategory,
  updateLaborCategory,
  deleteLaborCategory,
} from "../controller/laborCategoriesController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getLaborCategories);
router.get("/:id", validateObjectId("id"), getLaborCategory);
router.post("/", validateFields(["descripcion", "unidad", "precio"]), createLaborCategory);
router.put(
  "/:id",
  validateObjectId("id"),
  validateFields(["descripcion", "unidad", "precio"]),
  updateLaborCategory
);
router.delete("/:id", validateObjectId("id"), deleteLaborCategory);

export default router;
