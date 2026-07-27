import { Router } from "express";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../controller/companyController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getCompanies);
router.get("/:id", validateObjectId("id"), getCompany);
router.post("/", validateFields(["nombre", "nit"]), createCompany);
router.put("/:id", validateObjectId("id"), validateFields(["nombre", "nit"]), updateCompany);
router.delete("/:id", validateObjectId("id"), deleteCompany);

export default router;
