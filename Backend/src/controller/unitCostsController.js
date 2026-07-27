import UnitCosts from "../models/UnitCostsModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { checkRequired, getFirstError } from "../utils/Validator.js";

// codigo_p (partida) isn't populated — callers already have the partida from
// partidasService and filter unit costs by ?codigo_p=<id>, so codigo_p stays
// a plain id here to keep that comparison simple.
const populateRefs = (query) => query.populate("codigo_m").populate("codigo_cat").populate("codigo_pu").populate("codigo_e");

// codigo_m is required for equipo/material lines, codigo_cat for mano_obra —
// conditional on `categoria`, so it's validated here rather than as a plain
// mongoose `required` or in the router's flat validateFields list.
function validateCategoryFields({ categoria, codigo_m, codigo_cat }) {
  if (categoria === "mano_obra") {
    return checkRequired(codigo_cat, "categoría de mano de obra");
  }
  if (categoria === "equipo" || categoria === "material") {
    return checkRequired(codigo_m, "material");
  }
  return "categoría inválida";
}

export const getUnitCosts = catchAsync(async (req, res) => {
  const filter = { codigo_e: req.user.codigo_e };
  if (req.query.codigo_p) filter.codigo_p = req.query.codigo_p;
  const unitCosts = await populateRefs(UnitCosts.find(filter));
  res.json(unitCosts);
});

export const getUnitCost = catchAsync(async (req, res) => {
  const unitCost = await populateRefs(UnitCosts.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e }));
  if (!unitCost) {
    return res.status(404).json({ message: "Costo unitario no encontrado" });
  }
  res.json(unitCost);
});

export const createUnitCost = catchAsync(async (req, res) => {
  const { categoria, codigo_p, codigo_m, codigo_pu, codigo_cat, unidad, cantidad, rendimiento, tarifa } = req.body;

  const validationError = getFirstError([
    checkRequired(categoria, "categoría"),
    checkRequired(codigo_p, "partida"),
    checkRequired(unidad, "unidad"),
    checkRequired(cantidad, "cantidad"),
    checkRequired(tarifa, "tarifa"),
    validateCategoryFields({ categoria, codigo_m, codigo_cat }),
  ]);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const newUnitCost = new UnitCosts({
    categoria,
    codigo_p,
    codigo_m: categoria === "mano_obra" ? undefined : codigo_m,
    codigo_pu: categoria === "material" ? codigo_pu : undefined,
    codigo_cat: categoria === "mano_obra" ? codigo_cat : undefined,
    unidad,
    cantidad,
    rendimiento: categoria === "material" ? undefined : rendimiento,
    tarifa,
    codigo_e: req.user.codigo_e,
  });

  const unitCostSaved = await newUnitCost.save();
  res.status(201).json(await populateRefs(UnitCosts.findById(unitCostSaved._id)));
});

export const updateUnitCost = catchAsync(async (req, res) => {
  const { categoria, codigo_p, codigo_m, codigo_pu, codigo_cat, unidad, cantidad, rendimiento, tarifa } = req.body;

  const validationError = getFirstError([
    checkRequired(categoria, "categoría"),
    checkRequired(unidad, "unidad"),
    checkRequired(cantidad, "cantidad"),
    checkRequired(tarifa, "tarifa"),
    validateCategoryFields({ categoria, codigo_m, codigo_cat }),
  ]);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const updatedUnitCost = await UnitCosts.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    {
      categoria,
      codigo_p,
      codigo_m: categoria === "mano_obra" ? undefined : codigo_m,
      codigo_pu: categoria === "material" ? codigo_pu : undefined,
      codigo_cat: categoria === "mano_obra" ? codigo_cat : undefined,
      unidad,
      cantidad,
      rendimiento: categoria === "material" ? undefined : rendimiento,
      tarifa,
    },
    { new: true }
  );
  if (!updatedUnitCost) {
    return res.status(404).json({ message: "Costo unitario no encontrado" });
  }
  res.json(await populateRefs(UnitCosts.findById(updatedUnitCost._id)));
});

export const deleteUnitCost = catchAsync(async (req, res) => {
  const deletedUnitCost = await UnitCosts.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedUnitCost) {
    return res.status(404).json({ message: "Costo unitario no encontrado" });
  }
  res.status(204).end();
});
