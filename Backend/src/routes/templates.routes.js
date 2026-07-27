import { Router } from "express";
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controller/templatesController.js";
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

router.get("/", getTemplates);
router.get("/:id", validateObjectId("id"), getTemplate);
router.post("/", validateFields(requiredFields), createTemplate);
router.put("/:id", validateObjectId("id"), validateFields(requiredFields), updateTemplate);
router.delete("/:id", validateObjectId("id"), deleteTemplate);

export default router;
