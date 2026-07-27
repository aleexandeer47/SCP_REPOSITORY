import Project from "../models/ProjectModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ codigo_e: req.user.codigo_e });
  res.json(projects);
});

export const getProject = catchAsync(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }
  res.json(project);
});

export const createProject = catchAsync(async (req, res) => {
  const { nombre_proyecto, direccion, cliente } = req.body;
  const newProject = new Project({ nombre_proyecto, direccion, cliente, codigo_e: req.user.codigo_e });
  const projectSaved = await newProject.save();
  res.status(201).json(projectSaved);
});

export const updateProject = catchAsync(async (req, res) => {
  const { nombre_proyecto, direccion, cliente } = req.body;
  const updatedProject = await Project.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    { nombre_proyecto, direccion, cliente },
    { new: true, runValidators: true }
  );
  if (!updatedProject) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }
  res.json(updatedProject);
});

export const deleteProject = catchAsync(async (req, res) => {
  const deletedProject = await Project.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedProject) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }
  res.status(204).end();
});
