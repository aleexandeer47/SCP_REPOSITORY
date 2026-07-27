import UnitCosts from "../models/UnitCostsModel.js";
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

export const getUnitCosts = catchAsync(async (req, res) => {
  const unitCosts = await populateRefs(UnitCosts.find());
  res.json(unitCosts);
});

export const getUnitCost = catchAsync(async (req, res) => {
  const unitCost = await populateRefs(UnitCosts.findById(req.params.id));
  if (!unitCost) {
    return res.status(404).json({ message: "Costo unitario no encontrado" });
  }
  res.json(unitCost);
});

export const createUnitCost = catchAsync(async (req, res) => {
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

  const newUnitCost = new UnitCosts({
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

  const unitCostSaved = await newUnitCost.save();
  res.status(201).json(unitCostSaved);
});

export const updateUnitCost = catchAsync(async (req, res) => {
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

  const updatedUnitCost = await UnitCosts.findByIdAndUpdate(
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

  if (!updatedUnitCost) {
    return res.status(404).json({ message: "Costo unitario no encontrado" });
  }
  res.json(updatedUnitCost);
});

export const deleteUnitCost = catchAsync(async (req, res) => {
  const deletedUnitCost = await UnitCosts.findByIdAndDelete(req.params.id);
  if (!deletedUnitCost) {
    return res.status(404).json({ message: "Costo unitario no encontrado" });
  }
  res.status(204).end();
});
