// Envuelve controladores async para enviar cualquier error al middleware de errores de Express
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
