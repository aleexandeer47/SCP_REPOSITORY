import Budgets from "../models/BudgetsModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getBudgets = catchAsync(async (req, res) => {
  const budgets = await Budgets.find()
    .populate("codigo_proyecto")
    .populate("codigo_e")
    .populate("codigo_cu");
  res.json(budgets);
});

export const getBudget = catchAsync(async (req, res) => {
  const budget = await Budgets.findById(req.params.id)
    .populate("codigo_proyecto")
    .populate("codigo_e")
    .populate("codigo_cu");
  if (!budget) {
    return res.status(404).json({ message: "Presupuesto no encontrado" });
  }
  res.json(budget);
});

export const createBudget = catchAsync(async (req, res) => {
  const { total, total_iva, codigo_proyecto, codigo_e, codigo_cu } = req.body;
  const newBudget = new Budgets({ total, total_iva, codigo_proyecto, codigo_e, codigo_cu });
  const budgetSaved = await newBudget.save();
  res.status(201).json(budgetSaved);
});

export const updateBudget = catchAsync(async (req, res) => {
  const { total, total_iva, codigo_proyecto, codigo_e, codigo_cu } = req.body;
  const updatedBudget = await Budgets.findByIdAndUpdate(
    req.params.id,
    { total, total_iva, codigo_proyecto, codigo_e, codigo_cu },
    { new: true }
  );
  if (!updatedBudget) {
    return res.status(404).json({ message: "Presupuesto no encontrado" });
  }
  res.json(updatedBudget);
});

export const deleteBudget = catchAsync(async (req, res) => {
  const deletedBudget = await Budgets.findByIdAndDelete(req.params.id);
  if (!deletedBudget) {
    return res.status(404).json({ message: "Presupuesto no encontrado" });
  }
  res.status(204).end();
});
