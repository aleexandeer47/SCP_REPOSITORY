import Templates from "../models/TemplatesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const populateRefs = (query) =>
  query
    .populate("codigo_m")
    .populate("codigo_p")
    .populate("codigo_ci")
    .populate("codigo_e")
    .populate("codigo_pu")
    .populate("codigo_proyecto")
    .populate("codigo_cat");

export const getTemplates = catchAsync(async (req, res) => {
  const templates = await populateRefs(Templates.find());
  res.json(templates);
});

export const getTemplate = catchAsync(async (req, res) => {
  const template = await populateRefs(Templates.findById(req.params.id));
  if (!template) {
    return res.status(404).json({ message: "Plantilla no encontrada" });
  }
  res.json(template);
});

export const createTemplate = catchAsync(async (req, res) => {
  const {
    cantidad_material,
    rendimiento,
    calculo_precioU,
    produccion_xdia,
    factor_incremento,
    total,
    codigo_m,
    codigo_p,
    codigo_ci,
    codigo_e,
    codigo_pu,
    codigo_proyecto,
    codigo_cat,
  } = req.body;

  const newTemplate = new Templates({
    cantidad_material,
    rendimiento,
    calculo_precioU,
    produccion_xdia,
    factor_incremento,
    total,
    codigo_m,
    codigo_p,
    codigo_ci,
    codigo_e,
    codigo_pu,
    codigo_proyecto,
    codigo_cat,
  });

  const templateSaved = await newTemplate.save();
  res.status(201).json(templateSaved);
});

export const updateTemplate = catchAsync(async (req, res) => {
  const {
    cantidad_material,
    rendimiento,
    calculo_precioU,
    produccion_xdia,
    factor_incremento,
    total,
    codigo_m,
    codigo_p,
    codigo_ci,
    codigo_e,
    codigo_pu,
    codigo_proyecto,
    codigo_cat,
  } = req.body;

  const updatedTemplate = await Templates.findByIdAndUpdate(
    req.params.id,
    {
      cantidad_material,
      rendimiento,
      calculo_precioU,
      produccion_xdia,
      factor_incremento,
      total,
      codigo_m,
      codigo_p,
      codigo_ci,
      codigo_e,
      codigo_pu,
      codigo_proyecto,
      codigo_cat,
    },
    { new: true }
  );

  if (!updatedTemplate) {
    return res.status(404).json({ message: "Plantilla no encontrada" });
  }
  res.json(updatedTemplate);
});

export const deleteTemplate = catchAsync(async (req, res) => {
  const deletedTemplate = await Templates.findByIdAndDelete(req.params.id);
  if (!deletedTemplate) {
    return res.status(404).json({ message: "Plantilla no encontrada" });
  }
  res.status(204).end();
});
