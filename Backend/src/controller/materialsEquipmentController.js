import MaterialsEquipment from "../models/MaterialsEquipmentModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getMaterialsEquipment = catchAsync(async (req, res) => {
  const materials = await MaterialsEquipment.find().populate("codigo_cm").populate("codigo_e");
  res.json(materials);
});

export const getMaterialEquipment = catchAsync(async (req, res) => {
  const material = await MaterialsEquipment.findById(req.params.id)
    .populate("codigo_cm")
    .populate("codigo_e");
  if (!material) {
    return res.status(404).json({ message: "Material/equipo no encontrado" });
  }
  res.json(material);
});

export const createMaterialEquipment = catchAsync(async (req, res) => {
  const { descripcion, codigo_cm, codigo_e } = req.body;
  const newMaterial = new MaterialsEquipment({ descripcion, codigo_cm, codigo_e });
  const materialSaved = await newMaterial.save();
  res.status(201).json(materialSaved);
});

export const updateMaterialEquipment = catchAsync(async (req, res) => {
  const { descripcion, codigo_cm, codigo_e } = req.body;
  const updatedMaterial = await MaterialsEquipment.findByIdAndUpdate(
    req.params.id,
    { descripcion, codigo_cm, codigo_e },
    { new: true }
  );
  if (!updatedMaterial) {
    return res.status(404).json({ message: "Material/equipo no encontrado" });
  }
  res.json(updatedMaterial);
});

export const deleteMaterialEquipment = catchAsync(async (req, res) => {
  const deletedMaterial = await MaterialsEquipment.findByIdAndDelete(req.params.id);
  if (!deletedMaterial) {
    return res.status(404).json({ message: "Material/equipo no encontrado" });
  }
  res.status(204).end();
});
