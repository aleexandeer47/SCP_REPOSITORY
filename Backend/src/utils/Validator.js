import mongoose from "mongoose";
import dns from "node:dns/promises";

/*
  Este archivo es nuestra caja de herramientas para validar datos.
  Aquí definimos funciones auxiliares para revisar que lo que nos manda el cliente
  tenga el formato correcto, no esté vacío, sea un número válido, un ID de MongoDB real, etc.
  Así evitamos que explote la base de datos o que guardemos basura.
*/

/**
 * Valida si un valor está presente y no está vacío (no permite null, undefined, strings vacíos o compuestos solo de espacios).
 */
export const checkRequired = (value, fieldName) => {
  if (value === undefined || value === null) {
    return `El campo ${fieldName} es obligatorio.`;
  }
  if (typeof value === "string" && value.trim() === "") {
    return `El campo ${fieldName} es obligatorio y no puede estar vacío.`;
  }
  return null;
};

/**
 * Valida la longitud mínima y máxima de una cadena de texto.
 */
export const checkLength = (value, fieldName, min, max) => {
  if (value === undefined || value === null || value === "") return null;
  const str = String(value);
  if (str.length < min) {
    return `El campo ${fieldName} debe tener al menos ${min} caracteres.`;
  }
  if (str.length > max) {
    return `El campo ${fieldName} no puede exceder los ${max} caracteres.`;
  }
  return null;
};

/**
 * Valida el formato de un correo electrónico.
 */
export const checkEmail = (value, fieldName = "correo electrónico") => {
  const reqErr = checkRequired(value, fieldName);
  if (reqErr) return reqErr;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return `El formato del ${fieldName} no es válido.`;
  }
  return null;
};

/**
 * Valida el formato del NIT de El Salvador: NNNN-NNNNNN-NNN-N.
 */
export const checkNit = (value, fieldName = "NIT") => {
  const reqErr = checkRequired(value, fieldName);
  if (reqErr) return reqErr;

  const nitRegex = /^\d{4}-\d{6}-\d{3}-\d$/;
  if (!nitRegex.test(String(value).trim())) {
    return `El formato del ${fieldName} no es válido. Usa el formato 0000-000000-000-0.`;
  }
  return null;
};

/**
 * Valida que un valor sea un ID de MongoDB (ObjectId) válido.
 */
export const checkObjectId = (value, fieldName) => {
  if (!value) return `El campo ${fieldName} es obligatorio.`;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return `El campo ${fieldName} no es un ID válido.`;
  }
  return null;
};

/**
 * Valida opcionalmente que un valor sea un ID de MongoDB (ObjectId) válido si viene informado.
 */
export const checkOptionalObjectId = (value, fieldName) => {
  if (value === undefined || value === null || value === "") return null;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return `El campo ${fieldName} no es un ID válido.`;
  }
  return null;
};

/**
 * Valida que un valor pertenezca a un conjunto de valores permitidos (Enum).
 */
export const checkEnum = (value, allowedValues, fieldName) => {
  if (value === undefined || value === null || value === "") return null;
  if (!allowedValues.includes(value)) {
    return `El valor de ${fieldName} no es válido. Valores permitidos: ${allowedValues.join(", ")}.`;
  }
  return null;
};

/**
 * Valida que un valor sea un número válido y cumpla con rangos opcionales.
 */
export const checkNumber = (value, fieldName, { min = 0, max = Infinity, integer = false } = {}) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (isNaN(num)) {
    return `El campo ${fieldName} debe ser un número válido.`;
  }
  if (integer && !Number.isInteger(num)) {
    return `El campo ${fieldName} debe ser un número entero.`;
  }
  if (num < min) {
    return `El campo ${fieldName} no puede ser menor que ${min}.`;
  }
  if (num > max) {
    return `El campo ${fieldName} no puede ser mayor que ${max}.`;
  }
  return null;
};

/**
 * Valida un campo de tipo fecha, impidiendo opcionalmente fechas futuras o pasadas.
 */
export const checkDate = (value, fieldName, { allowFuture = true, allowPast = true } = {}) => {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return `El campo ${fieldName} debe ser una fecha válida.`;
  }
  const now = new Date();
  if (!allowFuture && date > now) {
    return `La fecha de ${fieldName} no puede ser una fecha futura.`;
  }
  if (!allowPast) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return `La fecha de ${fieldName} no puede ser anterior a la fecha actual.`;
    }
  }
  return null;
};

/**
 * Verifica que el dominio del correo exista de verdad y pueda recibir
 * correo (consulta sus registros MX), para atrapar dominios inventados
 * como "correo@asdasd.com". Es async, así que va aparte de getFirstError.
 *
 * Si la consulta DNS falla por un problema ajeno al dominio (timeout, sin
 * red, etc.) no bloqueamos el registro — solo rechazamos cuando el propio
 * DNS confirma que el dominio no existe.
 */
export const checkEmailDomain = async (value, fieldName = "correo electrónico") => {
  const domain = String(value || "").split("@")[1];
  if (!domain) return `El formato del ${fieldName} no es válido.`;

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return `El dominio del ${fieldName} no puede recibir correos.`;
    }
    return null;
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ENODATA") {
      return `El dominio del ${fieldName} no existe.`;
    }
    return null;
  }
};

/**
 * Devuelve el primer error no nulo de un listado de errores.
 */
export const getFirstError = (errors) => {
  return errors.find((err) => err !== null) || null;
};
