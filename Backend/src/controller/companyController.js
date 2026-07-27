import Company from "../models/CompanyModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { checkRequired, checkLength, checkNit, getFirstError } from "../utils/Validator.js";

// Cada empresa solo puede ver y editar su propia información, nunca la de
// otra — por eso estos endpoints ignoran cualquier id que venga en la URL o
// el body y siempre usan req.user.codigo_e, derivado del JWT del admin
// autenticado. No existe endpoint para listar todas las empresas ni para
// crear/eliminar una: una empresa nueva solo se crea vía /api/registro.
export const getMyCompany = catchAsync(async (req, res) => {
  const company = await Company.findById(req.user.codigo_e);
  if (!company) {
    return res.status(404).json({ message: "Empresa no encontrada" });
  }
  res.json(company);
});

export const updateMyCompany = catchAsync(async (req, res) => {
  const { nombre, nit } = req.body;

  const validationError = getFirstError([
    checkRequired(nombre, "nombre de la empresa"),
    checkLength(nombre, "nombre de la empresa", 2, 70),
    checkNit(nit),
  ]);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    req.user.codigo_e,
    { nombre: nombre.trim(), nit: nit.trim() },
    { new: true, runValidators: true }
  );
  if (!updatedCompany) {
    return res.status(404).json({ message: "Empresa no encontrada" });
  }
  res.json(updatedCompany);
});
