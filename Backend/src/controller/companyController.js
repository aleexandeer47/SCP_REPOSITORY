import Company from "../models/CompanyModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getCompanies = catchAsync(async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

export const getCompany = catchAsync(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ message: "Empresa no encontrada" });
  }
  res.json(company);
});

export const createCompany = catchAsync(async (req, res) => {
  const { nombre, nit } = req.body;
  const newCompany = new Company({ nombre, nit });
  const companySaved = await newCompany.save();
  res.status(201).json(companySaved);
});

export const updateCompany = catchAsync(async (req, res) => {
  const { nombre, nit } = req.body;
  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    { nombre, nit },
    { new: true }
  );
  if (!updatedCompany) {
    return res.status(404).json({ message: "Empresa no encontrada" });
  }
  res.json(updatedCompany);
});

export const deleteCompany = catchAsync(async (req, res) => {
  const deletedCompany = await Company.findByIdAndDelete(req.params.id);
  if (!deletedCompany) {
    return res.status(404).json({ message: "Empresa no encontrada" });
  }
  res.status(204).end();
});
