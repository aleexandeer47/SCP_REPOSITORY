import mongoose from "mongoose";

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Valida que uno o varios parámetros de ruta sean ObjectId válidos de Mongo
export const validateObjectId = (...params) => (req, res, next) => {
  for (const param of params) {
    const value = req.params[param];
    if (!isValidObjectId(value)) {
      return res.status(400).json({ message: `El identificador '${param}' no es válido` });
    }
  }
  next();
};

// Valida que los campos requeridos estén presentes en el body
export const validateFields = (fields) => (req, res, next) => {
  const missing = fields.filter(
    (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ""
  );

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${missing.join(", ")}`,
    });
  }
  next();
};

// Valida que los campos indicados sean numéricos cuando se envían
export const validateNumberFields = (fields) => (req, res, next) => {
  const invalid = fields.filter(
    (field) =>
      req.body[field] !== undefined && req.body[field] !== null && isNaN(Number(req.body[field]))
  );

  if (invalid.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos deben ser numéricos: ${invalid.join(", ")}`,
    });
  }
  next();
};
