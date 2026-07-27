import { Router } from "express";
import { getMyCompany, updateMyCompany } from "../controller/companyController.js";
import { authRequired } from "../middlewares/authRequired.js";

const router = Router();

router.use(authRequired);

router.get("/me", getMyCompany);
router.put("/me", updateMyCompany);

export default router;
