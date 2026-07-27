import UnitsMeasurement from "../models/UnitsMeasurementModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getUnitsMeasurement = catchAsync(async (req, res) => {
  const units = await UnitsMeasurement.find().populate("codigo_e");
  res.json(units);
});

export const getUnitMeasurement = catchAsync(async (req, res) => {
  const unit = await UnitsMeasurement.findById(req.params.id).populate("codigo_e");
  if (!unit) {
    return res.status(404).json({ message: "Unidad de medida no encontrada" });
  }
  res.json(unit);
});

export const createUnitMeasurement = catchAsync(async (req, res) => {
  const { nombre, abreviatura, codigo_e } = req.body;
  const newUnit = new UnitsMeasurement({ nombre, abreviatura, codigo_e });
  const unitSaved = await newUnit.save();
  res.status(201).json(unitSaved);
});

export const updateUnitMeasurement = catchAsync(async (req, res) => {
  const { nombre, abreviatura, codigo_e } = req.body;
  const updatedUnit = await UnitsMeasurement.findByIdAndUpdate(
    req.params.id,
    { nombre, abreviatura, codigo_e },
    { new: true }
  );
  if (!updatedUnit) {
    return res.status(404).json({ message: "Unidad de medida no encontrada" });
  }
  res.json(updatedUnit);
});

export const deleteUnitMeasurement = catchAsync(async (req, res) => {
  const deletedUnit = await UnitsMeasurement.findByIdAndDelete(req.params.id);
  if (!deletedUnit) {
    return res.status(404).json({ message: "Unidad de medida no encontrada" });
  }
  res.status(204).end();
});
