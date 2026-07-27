// Este controlador maneja el cierre de sesión de los usuarios de SCP.
// Simplemente borra la cookie 'authCookie' del navegador para invalidar su sesión actual.
const logoutController = {};

// Cerrar sesión
// Limpia la cookie de autenticación y responde indicando que se cerró la sesión con éxito.
logoutController.logout = async (req, res) => {
  try {
    res.clearCookie("authCookie");
    return res.status(200).json({ message: "Sesión cerrada" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default logoutController;
