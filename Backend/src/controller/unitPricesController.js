import UnitPrices from "../models/UnitPricesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const populateRefs = (query) => query.populate("codigo_m").populate("codigo_u").populate("codigo_e");

export const getUnitPrices = catchAsync(async (req, res) => {
  const unitPrices = await populateRefs(UnitPrices.find({ codigo_e: req.user.codigo_e }));
  res.json(unitPrices);
});

export const getUnitPrice = catchAsync(async (req, res) => {
  const unitPrice = await populateRefs(UnitPrices.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e }));
  if (!unitPrice) {
    return res.status(404).json({ message: "Precio unitario no encontrado" });
  }
  res.json(unitPrice);
});

export const createUnitPrice = catchAsync(async (req, res) => {
  const { precio, presentacion, precio_unitario, codigo_m, codigo_u } = req.body;
  const newUnitPrice = new UnitPrices({
    precio,
    presentacion,
    precio_unitario,
    codigo_m,
    codigo_u,
    codigo_e: req.user.codigo_e,
  });
  const unitPriceSaved = await newUnitPrice.save();
  res.status(201).json(await populateRefs(UnitPrices.findById(unitPriceSaved._id)));
});

export const updateUnitPrice = catchAsync(async (req, res) => {
  const { precio, presentacion, precio_unitario, codigo_m, codigo_u } = req.body;
  const updatedUnitPrice = await UnitPrices.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    { precio, presentacion, precio_unitario, codigo_m, codigo_u },
    { new: true }
  );
  if (!updatedUnitPrice) {
    return res.status(404).json({ message: "Precio unitario no encontrado" });
  }
  res.json(await populateRefs(UnitPrices.findById(updatedUnitPrice._id)));
});

export const deleteUnitPrice = catchAsync(async (req, res) => {
  const deletedUnitPrice = await UnitPrices.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedUnitPrice) {
    return res.status(404).json({ message: "Precio unitario no encontrado" });
  }
  res.status(204).end();
});
