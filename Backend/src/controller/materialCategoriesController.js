import MaterialCategories from "../models/MaterialCategoriesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getMaterialCategories = catchAsync(async (req, res) => {
  const categories = await MaterialCategories.find().populate("codigo_e");
  res.json(categories);
});

export const getMaterialCategory = catchAsync(async (req, res) => {
  const category = await MaterialCategories.findById(req.params.id).populate("codigo_e");
  if (!category) {
    return res.status(404).json({ message: "Categoría de material no encontrada" });
  }
  res.json(category);
});

export const createMaterialCategory = catchAsync(async (req, res) => {
  const { descripcion, codigo_e } = req.body;
  const newCategory = new MaterialCategories({ descripcion, codigo_e });
  const categorySaved = await newCategory.save();
  res.status(201).json(categorySaved);
});

export const updateMaterialCategory = catchAsync(async (req, res) => {
  const { descripcion, codigo_e } = req.body;
  const updatedCategory = await MaterialCategories.findByIdAndUpdate(
    req.params.id,
    { descripcion, codigo_e },
    { new: true }
  );
  if (!updatedCategory) {
    return res.status(404).json({ message: "Categoría de material no encontrada" });
  }
  res.json(updatedCategory);
});

export const deleteMaterialCategory = catchAsync(async (req, res) => {
  const deletedCategory = await MaterialCategories.findByIdAndDelete(req.params.id);
  if (!deletedCategory) {
    return res.status(404).json({ message: "Categoría de material no encontrada" });
  }
  res.status(204).end();
});
