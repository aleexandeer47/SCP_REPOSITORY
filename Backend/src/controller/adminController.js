import Admin from "../models/AdminModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import {
  checkRequired,
  checkLength,
  checkEmail,
  checkObjectId,
  checkEmailDomain,
  getFirstError,
} from "../utils/Validator.js";
import { respondWithError } from "../utils/describeMongooseError.js";

// Este controlador se encarga de todo el ciclo de vida (CRUD) de las cuentas de usuario de SCP.
// Permite listarlas, ver detalles individuales, registrar nuevas cuentas, actualizarlas y eliminarlas,
// controlando las validaciones de campos, la encriptación de contraseñas y la subida de fotos de perfil.
// Todo queda restringido a la empresa (codigo_e) del admin autenticado — nunca se confía en un
// codigo_e que venga en el body, para que un admin de una empresa no pueda listar/crear/editar
// usuarios de otra.
const adminController = {};

// Obtener todos los usuarios de la misma empresa que el admin autenticado
adminController.getUsers = async (req, res) => {
  try {
    const users = await Admin.find({ codigo_e: req.user.codigo_e }).select("-contrasena").populate("codigo_e");
    return res.status(200).json(users);
  } catch (error) {
    return respondWithError(res, error);
  }
};

// Obtener usuario por ID (solo si pertenece a la misma empresa)
adminController.getUser = async (req, res) => {
  try {
    const idError = checkObjectId(req.params.id, "ID");
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    const user = await Admin.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e })
      .select("-contrasena")
      .populate("codigo_e");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return respondWithError(res, error);
  }
};

// Registrar usuario dentro de la propia empresa del admin autenticado.
// SCP no tiene roles: todo usuario que se crea es administrador de su
// empresa, así que isAdmin nunca se lee del body — siempre queda en true.
adminController.register = async (req, res) => {
  try {
    let { usuario, contrasena, email } = req.body;
    const codigo_e = req.user.codigo_e;

    const validationError = getFirstError([
      checkRequired(usuario, "usuario"),
      checkLength(usuario, "usuario", 3, 70),
      checkRequired(contrasena, "contraseña"),
      checkLength(contrasena, "contraseña", 6, 50),
      checkEmail(email, "correo electrónico"),
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    usuario = usuario?.trim();
    email = email?.trim()?.toLowerCase();

    const emailDomainError = await checkEmailDomain(email);
    if (emailDomainError) {
      return res.status(400).json({ message: emailDomainError });
    }

    const existUser = await Admin.findOne({ $or: [{ usuario }, { email }] });
    if (existUser) {
      return res.status(400).json({ message: "El usuario o el correo electrónico ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(contrasena, 10);

    const newUser = new Admin({
      usuario,
      contrasena: passwordHash,
      email,
      isAdmin: true,
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
    return respondWithError(res, error);
  }
};

// Actualizar usuario (solo si pertenece a la misma empresa que el admin autenticado)
adminController.updateUser = async (req, res) => {
  try {
    const idError = checkObjectId(req.params.id, "ID");
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    let { usuario, contrasena, email } = req.body;

    const validationError = getFirstError([
      checkLength(usuario, "usuario", 3, 70),
      checkLength(contrasena, "contraseña", 6, 50),
      email ? checkEmail(email, "correo electrónico") : null,
    ]);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (email) {
      const emailDomainError = await checkEmailDomain(email);
      if (emailDomainError) {
        return res.status(400).json({ message: emailDomainError });
      }
    }

    const userFound = await Admin.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e });
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
    return respondWithError(res, error);
  }
};

// Eliminar usuario (solo si pertenece a la misma empresa que el admin autenticado)
adminController.deleteUser = async (req, res) => {
  try {
    const idError = checkObjectId(req.params.id, "ID");
    if (idError) {
      return res.status(400).json({ message: idError });
    }

    const userFound = await Admin.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e });
    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Toda empresa debe tener siempre al menos un usuario para poder
    // iniciar sesión — nunca puede quedar huérfana.
    const userCount = await Admin.countDocuments({ codigo_e: req.user.codigo_e });
    if (userCount <= 1) {
      return res.status(400).json({ message: "No puedes eliminar al último usuario de la empresa. Toda empresa debe tener al menos un usuario." });
    }

    if (userFound.public_id) {
      await cloudinary.uploader.destroy(userFound.public_id);
    }

    await Admin.findByIdAndDelete(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return respondWithError(res, error);
  }
};

export default adminController;
