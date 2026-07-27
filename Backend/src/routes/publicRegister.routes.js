import { Router } from "express";
import { registerCompany } from "../controller/publicRegisterController.js";

const router = Router();

// Deliberately no authRequired — this is how a brand new company gets its
// first admin. Everything else user-management-related requires being
// already authenticated (see admin.routes.js).
router.post("/", registerCompany);

export default router;
