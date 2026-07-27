import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";
import { authRequired } from "../middlewares/authRequired.js";
import { validateFields, validateObjectId } from "../utils/validators.js";

const router = Router();

router.use(authRequired);

router.get("/", getProjects);
router.get("/:id", validateObjectId("id"), getProject);
router.post("/", validateFields(["nombre_proyecto", "direccion"]), createProject);
router.put(
  "/:id",
  validateObjectId("id"),
  validateFields(["nombre_proyecto", "direccion"]),
  updateProject
);
router.delete("/:id", validateObjectId("id"), deleteProject);

export default router;
