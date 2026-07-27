// Translates raw Mongoose errors (English, no business context) into a
// message a user can actually act on. Without this, any invalid data (a
// field too long, a duplicate unique value, a malformed id in the body)
// surfaces to the frontend as a bare "Error interno del servidor" with no
// indication of what to fix.
const VALIDATOR_MESSAGES = {
  required: (e) => `El campo "${e.path}" es obligatorio.`,
  maxlength: (e) => `El campo "${e.path}" no puede tener más de ${e.properties?.maxlength} caracteres.`,
  minlength: (e) => `El campo "${e.path}" debe tener al menos ${e.properties?.minlength} caracteres.`,
  enum: (e) => `El valor de "${e.path}" no es válido.`,
  min: (e) => `El campo "${e.path}" no puede ser menor que ${e.properties?.min}.`,
  max: (e) => `El campo "${e.path}" no puede ser mayor que ${e.properties?.max}.`,
};

// A failed ref cast (e.g. codigo_cm: "not-an-id") doesn't throw a top-level
// CastError — Mongoose folds it into the ValidationError's `.errors` map as
// a nested CastError instance, so it needs the same translation there too.
function describeFieldError(fieldError) {
  if (fieldError.name === "CastError") {
    return `El valor proporcionado para "${fieldError.path}" no es válido.`;
  }
  return VALIDATOR_MESSAGES[fieldError.kind]?.(fieldError) || fieldError.message;
}

// Returns { status, message } for a recognized Mongoose error, or null if
// `error` isn't one (in which case the caller should fall back to a generic
// 500 — this only handles the "bad input" shapes, not real server failures).
export function describeMongooseError(error) {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map(describeFieldError).join(" ");
    return { status: 400, message };
  }

  if (error.name === "CastError") {
    return { status: 400, message: `El valor proporcionado para "${error.path}" no es válido.` };
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0];
    return { status: 409, message: field ? `Ya existe un registro con ese ${field}.` : "Ya existe un registro con esos datos." };
  }

  return null;
}

// Convenience for controllers that catch errors manually instead of routing
// through catchAsync + app.js's error middleware (loginController,
// recoveryPasswordController, adminController).
export function respondWithError(res, error) {
  console.log("error " + error);
  const known = describeMongooseError(error);
  if (known) {
    return res.status(known.status).json({ message: known.message });
  }
  return res.status(500).json({ message: "Error interno del servidor" });
}
