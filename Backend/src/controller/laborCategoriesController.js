import LaborCategories from "../models/LaborCategoriesModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getLaborCategories = catchAsync(async (req, res) => {
  const categories = await LaborCategories.find({ codigo_e: req.user.codigo_e });
  res.json(categories);
});

export const getLaborCategory = catchAsync(async (req, res) => {
  const category = await LaborCategories.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!category) {
    return res.status(404).json({ message: "Categoría de mano de obra no encontrada" });
  }
  res.json(category);
});

export const createLaborCategory = catchAsync(async (req, res) => {
  const { descripcion, unidad, precio } = req.body;
  const newCategory = new LaborCategories({ descripcion, unidad, precio, codigo_e: req.user.codigo_e });
  const categorySaved = await newCategory.save();
  res.status(201).json(categorySaved);
});

export const updateLaborCategory = catchAsync(async (req, res) => {
  const { descripcion, unidad, precio } = req.body;
  const updatedCategory = await LaborCategories.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    { descripcion, unidad, precio },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    return res.status(404).json({ message: "Categoría de mano de obra no encontrada" });
  }
  res.json(updatedCategory);
});

export const deleteLaborCategory = catchAsync(async (req, res) => {
  const deletedCategory = await LaborCategories.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedCategory) {
    return res.status(404).json({ message: "Categoría de mano de obra no encontrada" });
  }
  res.status(204).end();
});
