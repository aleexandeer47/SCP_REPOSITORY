import LaborCategories from "../models/LaborCategoriesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getLaborCategories = catchAsync(async (req, res) => {
  const categories = await LaborCategories.find();
  res.json(categories);
});

export const getLaborCategory = catchAsync(async (req, res) => {
  const category = await LaborCategories.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Categoría de mano de obra no encontrada" });
  }
  res.json(category);
});

export const createLaborCategory = catchAsync(async (req, res) => {
  const { descripcion, unidad, precio } = req.body;
  const newCategory = new LaborCategories({ descripcion, unidad, precio });
  const categorySaved = await newCategory.save();
  res.status(201).json(categorySaved);
});

export const updateLaborCategory = catchAsync(async (req, res) => {
  const { descripcion, unidad, precio } = req.body;
  const updatedCategory = await LaborCategories.findByIdAndUpdate(
    req.params.id,
    { descripcion, unidad, precio },
    { new: true }
  );
  if (!updatedCategory) {
    return res.status(404).json({ message: "Categoría de mano de obra no encontrada" });
  }
  res.json(updatedCategory);
});

export const deleteLaborCategory = catchAsync(async (req, res) => {
  const deletedCategory = await LaborCategories.findByIdAndDelete(req.params.id);
  if (!deletedCategory) {
    return res.status(404).json({ message: "Categoría de mano de obra no encontrada" });
  }
  res.status(204).end();
});
