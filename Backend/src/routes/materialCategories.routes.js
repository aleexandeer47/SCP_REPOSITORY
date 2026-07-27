import { Router } from "express";
import {
  getMaterialCategories,
  getMaterialCategory,
  createMaterialCategory,
  updateMaterialCategory,
  deleteMaterialCategory,
} from "../controller/materialCategoriesController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getMaterialCategories);
router.get("/:id", validateObjectId("id"), getMaterialCategory);
router.post("/", validateFields(["descripcion"]), createMaterialCategory);
router.put("/:id", validateObjectId("id"), validateFields(["descripcion"]), updateMaterialCategory);
router.delete("/:id", validateObjectId("id"), deleteMaterialCategory);

export default router;
