import Project from "../models/ProjectModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

export const getProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }
  res.json(project);
});

export const createProject = catchAsync(async (req, res) => {
  const { nombre_proyecto, direccion, cliente } = req.body;
  const newProject = new Project({ nombre_proyecto, direccion, cliente });
  const projectSaved = await newProject.save();
  res.status(201).json(projectSaved);
});

export const updateProject = catchAsync(async (req, res) => {
  const { nombre_proyecto, direccion, cliente } = req.body;
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    { nombre_proyecto, direccion, cliente },
    { new: true }
  );
  if (!updatedProject) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }
  res.json(updatedProject);
});

export const deleteProject = catchAsync(async (req, res) => {
  const deletedProject = await Project.findByIdAndDelete(req.params.id);
  if (!deletedProject) {
    return res.status(404).json({ message: "Proyecto no encontrado" });
  }
  res.status(204).end();
});
