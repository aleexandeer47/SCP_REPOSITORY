import Admin from "../models/AdminModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import {
  checkRequired,
  checkLength,
  checkEmail,
  checkObjectId,
  getFirstError,
} from "../utils/Validator.js";

// Este controlador se encarga de todo el ciclo de vida (CRUD) de las cuentas de usuario de SCP.
// Permite listarlas, ver detalles individuales, registrar nuevas cuentas, actualizarlas y eliminarlas,
// controlando las validaciones de campos, la encriptación de contraseñas y la subida de fotos de perfil.
const adminController = {};

// Obtener todos los usuarios
// Trae la lista completa de usuarios registrados, sin sus contraseñas y con la empresa asociada poblada.
adminController.getUsers = async (req, res) => {
  try {
    const users = await Admin.find().select("-contrasena").populate("codigo_e");
    return res.status(200).json(users);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener usuario por ID
// Busca los datos de un usuario en específico usando su ID, validando primero el formato del ID.
adminController.getUser = async (req, res) => {
  try {
    const idError = checkObjectId(req.params.id, "ID");
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    const user = await Admin.findById(req.params.id).select("-contrasena").populate("codigo_e");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Registrar usuario
// Crea una nueva cuenta en el sistema. Solo puede ejecutarlo un administrador ya autenticado.
// Valida los campos obligatorios, verifica que el usuario y el correo no estén repetidos,
// encripta la contraseña y sube la foto de perfil (si viene una en la petición) a Cloudinary.
adminController.register = async (req, res) => {
  try {
    let { usuario, contrasena, email, isAdmin, codigo_e } = req.body;

    const validationError = getFirstError([
      checkRequired(usuario, "usuario"),
      checkLength(usuario, "usuario", 3, 70),
      checkRequired(contrasena, "contraseña"),
      checkLength(contrasena, "contraseña", 6, 50),
      checkEmail(email, "correo electrónico"),
      checkObjectId(codigo_e, "empresa"),
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    usuario = usuario?.trim();
    email = email?.trim()?.toLowerCase();

    const existUser = await Admin.findOne({ $or: [{ usuario }, { email }] });
    if (existUser) {
      return res.status(400).json({ message: "El usuario o el correo electrónico ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(contrasena, 10);

    const newUser = new Admin({
      usuario,
      contrasena: passwordHash,
      email,
      isAdmin: isAdmin ?? false,
      codigo_e,
      image_url: req.file ? req.file.path : null,
      public_id: req.file ? req.file.filename : null,
    });

    const userSaved = await newUser.save();
    return res.status(201).json({
      id: userSaved._id,
      usuario: userSaved.usuario,
      email: userSaved.email,
      isAdmin: userSaved.isAdmin,
      codigo_e: userSaved.codigo_e,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Actualizar usuario
// Permite modificar los datos de un usuario existente. Verifica que el usuario/correo no esté ocupado
// por otra cuenta, encripta la contraseña si se envía una nueva y, si se sube una nueva imagen,
// actualiza la referencia y borra la anterior de Cloudinary.
adminController.updateUser = async (req, res) => {
  try {
    const idError = checkObjectId(req.params.id, "ID");
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    let { usuario, contrasena, email, isAdmin, codigo_e } = req.body;

    const validationError = getFirstError([
      checkLength(usuario, "usuario", 3, 70),
      checkLength(contrasena, "contraseña", 6, 50),
      email ? checkEmail(email, "correo electrónico") : null,
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const userFound = await Admin.findById(req.params.id);
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario = usuario?.trim();
    email = email?.trim()?.toLowerCase();

    if (usuario || email) {
      const inUse = await Admin.findOne({
        _id: { $ne: req.params.id },
        $or: [usuario ? { usuario } : null, email ? { email } : null].filter(Boolean),
      });
      if (inUse) {
        return res.status(400).json({ message: "El usuario o el correo electrónico ya está registrado" });
      }
    }

    const updateData = {
      usuario: usuario || userFound.usuario,
      email: email || userFound.email,
      isAdmin,
      codigo_e,
    };

    if (contrasena) {
      updateData.contrasena = await bcrypt.hash(contrasena, 10);
    }

    if (req.file) {
      updateData.image_url = req.file.path;
      updateData.public_id = req.file.filename;
    }

    const updatedUser = await Admin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-contrasena");

    if (req.file && userFound.public_id) {
      try {
        await cloudinary.uploader.destroy(userFound.public_id);
      } catch (err) {
        console.error("Error al eliminar imagen anterior:", err);
      }
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar usuario
// Borra de forma permanente una cuenta de usuario de la base de datos, junto con su foto de perfil en Cloudinary si tiene una.
adminController.deleteUser = async (req, res) => {
  try {
    const idError = checkObjectId(req.params.id, "ID");
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    const userFound = await Admin.findById(req.params.id);
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (userFound.public_id) {
      await cloudinary.uploader.destroy(userFound.public_id);
    }

    await Admin.findByIdAndDelete(req.params.id);
    return res.status(204).end();
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default adminController;
