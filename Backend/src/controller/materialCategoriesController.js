import MaterialCategories from "../models/MaterialCategoriesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getMaterialCategories = catchAsync(async (req, res) => {
  const categories = await MaterialCategories.find({ codigo_e: req.user.codigo_e }).populate("codigo_e");
  res.json(categories);
});

export const getMaterialCategory = catchAsync(async (req, res) => {
  const category = await MaterialCategories.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e }).populate("codigo_e");
  if (!category) {
    return res.status(404).json({ message: "Categoría de material no encontrada" });
  }
  res.json(category);
});

export const createMaterialCategory = catchAsync(async (req, res) => {
  const { descripcion } = req.body;
  const newCategory = new MaterialCategories({ descripcion, codigo_e: req.user.codigo_e });
  const categorySaved = await newCategory.save();
  res.status(201).json(categorySaved);
});

export const updateMaterialCategory = catchAsync(async (req, res) => {
  const { descripcion } = req.body;
  const updatedCategory = await MaterialCategories.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    { descripcion },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    return res.status(404).json({ message: "Categoría de material no encontrada" });
  }
  res.json(updatedCategory);
});

export const deleteMaterialCategory = catchAsync(async (req, res) => {
  const deletedCategory = await MaterialCategories.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedCategory) {
    return res.status(404).json({ message: "Categoría de material no encontrada" });
  }
  res.status(204).end();
});
