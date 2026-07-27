import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import { config } from "../config.js";
import { checkRequired, getFirstError } from "../utils/Validator.js";

// Este controlador maneja la autenticación y validación de sesiones de los usuarios de SCP.
// Se encarga de verificar credenciales, gestionar el bloqueo de cuentas tras múltiples intentos fallidos,
// emitir tokens JWT guardados en cookies HTTP-only y verificar si la sesión sigue activa.
const loginController = {};

// Iniciar sesión
// Valida usuario y contraseña, aplica el bloqueo temporal de 15 minutos tras 5 intentos erróneos,
// y si las credenciales son correctas limpia los reintentos, genera un token JWT en una cookie segura
// y devuelve el userType calculado a partir del flag isAdmin del usuario encontrado.
loginController.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    const validationError = getFirstError([
      checkRequired(usuario, "usuario"),
      checkRequired(contrasena, "contraseña"),
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const userFound = await Admin.findOne({ usuario });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar si la cuenta está bloqueada temporalmente
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    const isMatch = await bcrypt.compare(contrasena, userFound.contrasena);

    if (!isMatch) {
      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

      // Si falla 5 veces seguidas, se le bloquea el acceso por 15 minutos
      if (userFound.loginAttempts >= 5) {
        userFound.timeOut = Date.now() + 15 * 60 * 1000;
        userFound.loginAttempts = 0;
        await userFound.save();
        return res.status(403).json({ message: "Cuenta bloqueada" });
      }

      await userFound.save();
      return res.status(403).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Resetear los intentos y bloqueos al ingresar correctamente
    userFound.loginAttempts = 0;
    userFound.timeOut = null;
    await userFound.save();

    const userType = userFound.isAdmin ? "admin" : "user";

    const token = jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: "1d" }
    );

    res.cookie("authCookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Login exitoso", userType });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verificar sesión
// Sirve para validar si la cookie de sesión sigue siendo válida cuando un usuario entra o refresca la página.
// Desencripta el token JWT, busca al usuario en la base de datos y retorna su perfil sin la contraseña.
loginController.verify = async (req, res) => {
  try {
    const { authCookie } = req.cookies;
    if (!authCookie) {
      return res.status(401).json({ message: "No cookie found, Authorization required" });
    }

    const decoded = jsonwebtoken.verify(authCookie, config.JWT.secret);

    const userFound = await Admin.findById(decoded.id).select("-contrasena").populate("codigo_e");
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ user: userFound });
  } catch (error) {
    console.log("error " + error);
    return res.status(401).json({ message: "Invalid session or token expired" });
  }
};

export default loginController;
