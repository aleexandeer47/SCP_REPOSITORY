import IndirectCosts from "../models/IndirectCostsModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const populateRefs = (query) => query.populate("codigo_m").populate("codigo_e");

export const getIndirectCosts = catchAsync(async (req, res) => {
  const indirectCosts = await populateRefs(IndirectCosts.find({ codigo_e: req.user.codigo_e }));
  res.json(indirectCosts);
});

export const getIndirectCost = catchAsync(async (req, res) => {
  const indirectCost = await populateRefs(IndirectCosts.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e }));
  if (!indirectCost) {
    return res.status(404).json({ message: "Costo indirecto no encontrado" });
  }
  res.json(indirectCost);
});

export const createIndirectCost = catchAsync(async (req, res) => {
  const { precio, codigo_m } = req.body;
  const newIndirectCost = new IndirectCosts({ precio, codigo_m, codigo_e: req.user.codigo_e });
  const indirectCostSaved = await newIndirectCost.save();
  res.status(201).json(await populateRefs(IndirectCosts.findById(indirectCostSaved._id)));
});

export const updateIndirectCost = catchAsync(async (req, res) => {
  const { precio, codigo_m } = req.body;
  const updatedIndirectCost = await IndirectCosts.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    { precio, codigo_m },
    { new: true }
  );
  if (!updatedIndirectCost) {
    return res.status(404).json({ message: "Costo indirecto no encontrado" });
  }
  res.json(await populateRefs(IndirectCosts.findById(updatedIndirectCost._id)));
});

export const deleteIndirectCost = catchAsync(async (req, res) => {
  const deletedIndirectCost = await IndirectCosts.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedIndirectCost) {
    return res.status(404).json({ message: "Costo indirecto no encontrado" });
  }
  res.status(204).end();
});
