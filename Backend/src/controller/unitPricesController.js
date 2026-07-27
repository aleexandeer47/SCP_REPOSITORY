import UnitPrices from "../models/UnitPricesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getUnitPrices = catchAsync(async (req, res) => {
  const unitPrices = await UnitPrices.find()
    .populate("codigo_m")
    .populate("codigo_u")
    .populate("codigo_e");
  res.json(unitPrices);
});

export const getUnitPrice = catchAsync(async (req, res) => {
  const unitPrice = await UnitPrices.findById(req.params.id)
    .populate("codigo_m")
    .populate("codigo_u")
    .populate("codigo_e");
  if (!unitPrice) {
    return res.status(404).json({ message: "Precio unitario no encontrado" });
  }
  res.json(unitPrice);
});

export const createUnitPrice = catchAsync(async (req, res) => {
  const { precio, presentacion, precio_unitario, codigo_m, codigo_u, codigo_e } = req.body;
  const newUnitPrice = new UnitPrices({
    precio,
    presentacion,
    precio_unitario,
    codigo_m,
    codigo_u,
    codigo_e,
  });
  const unitPriceSaved = await newUnitPrice.save();
  res.status(201).json(unitPriceSaved);
});

export const updateUnitPrice = catchAsync(async (req, res) => {
  const { precio, presentacion, precio_unitario, codigo_m, codigo_u, codigo_e } = req.body;
  const updatedUnitPrice = await UnitPrices.findByIdAndUpdate(
    req.params.id,
    { precio, presentacion, precio_unitario, codigo_m, codigo_u, codigo_e },
    { new: true }
  );
  if (!updatedUnitPrice) {
    return res.status(404).json({ message: "Precio unitario no encontrado" });
  }
  res.json(updatedUnitPrice);
});

export const deleteUnitPrice = catchAsync(async (req, res) => {
  const deletedUnitPrice = await UnitPrices.findByIdAndDelete(req.params.id);
  if (!deletedUnitPrice) {
    return res.status(404).json({ message: "Precio unitario no encontrado" });
  }
  res.status(204).end();
});
