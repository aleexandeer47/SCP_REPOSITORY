// Requiere que authRequired se haya ejecutado antes para tener req.user disponible
export const isAdmin = (req, res, next) => {
  if (req.user?.userType !== "admin") {
    return res.status(403).json({ message: "Acceso restringido a administradores" });
  }
  next();
};
