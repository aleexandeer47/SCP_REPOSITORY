import IndirectCosts from "../models/IndirectCostsModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getIndirectCosts = catchAsync(async (req, res) => {
  const indirectCosts = await IndirectCosts.find().populate("codigo_m").populate("codigo_e");
  res.json(indirectCosts);
});

export const getIndirectCost = catchAsync(async (req, res) => {
  const indirectCost = await IndirectCosts.findById(req.params.id)
    .populate("codigo_m")
    .populate("codigo_e");
  if (!indirectCost) {
    return res.status(404).json({ message: "Costo indirecto no encontrado" });
  }
  res.json(indirectCost);
});

export const createIndirectCost = catchAsync(async (req, res) => {
  const { precio, codigo_m, codigo_e } = req.body;
  const newIndirectCost = new IndirectCosts({ precio, codigo_m, codigo_e });
  const indirectCostSaved = await newIndirectCost.save();
  res.status(201).json(indirectCostSaved);
});

export const updateIndirectCost = catchAsync(async (req, res) => {
  const { precio, codigo_m, codigo_e } = req.body;
  const updatedIndirectCost = await IndirectCosts.findByIdAndUpdate(
    req.params.id,
    { precio, codigo_m, codigo_e },
    { new: true }
  );
  if (!updatedIndirectCost) {
    return res.status(404).json({ message: "Costo indirecto no encontrado" });
  }
  res.json(updatedIndirectCost);
});

export const deleteIndirectCost = catchAsync(async (req, res) => {
  const deletedIndirectCost = await IndirectCosts.findByIdAndDelete(req.params.id);
  if (!deletedIndirectCost) {
    return res.status(404).json({ message: "Costo indirecto no encontrado" });
  }
  res.status(204).end();
});
