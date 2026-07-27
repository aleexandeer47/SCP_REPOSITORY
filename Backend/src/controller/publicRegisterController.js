import bcrypt from "bcryptjs";
import Company from "../models/CompanyModel.js";
import Admin from "../models/AdminModel.js";
import { checkRequired, checkLength, checkEmail, checkNit, checkEmailDomain, getFirstError } from "../utils/Validator.js";

// The only public (unauthenticated) way to get a new company onto SCP —
// everything else under /api/admin requires an existing admin, which is a
// chicken-and-egg problem for a brand new company. Creates the Company and
// its first Admin (isAdmin: true) together; every other user for that
// company is then created from the authenticated Usuarios screen.
export const registerCompany = async (req, res) => {
  let company;
  try {
    let { nombre_empresa, nit, usuario, contrasena, email } = req.body;

    const validationError = getFirstError([
      checkRequired(nombre_empresa, "nombre de la empresa"),
      checkLength(nombre_empresa, "nombre de la empresa", 2, 70),
      checkNit(nit),
      checkRequired(usuario, "usuario"),
      checkLength(usuario, "usuario", 3, 70),
      checkRequired(contrasena, "contraseña"),
      checkLength(contrasena, "contraseña", 6, 50),
      checkEmail(email, "correo electrónico"),
    ]);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    usuario = usuario.trim();
    email = email.trim().toLowerCase();
    nit = nit.trim();

    const emailDomainError = await checkEmailDomain(email);
    if (emailDomainError) {
      return res.status(400).json({ message: emailDomainError });
    }

    const existUser = await Admin.findOne({ $or: [{ usuario }, { email }] });
    if (existUser) {
      return res.status(409).json({ message: "El usuario o el correo electrónico ya está registrado" });
    }

    const existCompany = await Company.findOne({ nit });
    if (existCompany) {
      return res.status(409).json({ message: "Ya existe una empresa registrada con ese NIT" });
    }

    company = await Company.create({ nombre: nombre_empresa.trim(), nit });

    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const admin = await Admin.create({
      usuario,
      contrasena: contrasenaHash,
      email,
      isAdmin: true,
      codigo_e: company._id,
    });

    return res.status(201).json({
      empresa: { id: company._id, nombre: company.nombre },
      usuario: admin.usuario,
    });
  } catch (error) {
    // The admin create is the more likely failure (duplicate/validation) —
    // don't leave an orphaned company with nobody able to log into it.
    if (company) {
      await Company.findByIdAndDelete(company._id).catch(() => {});
    }
    console.log("error " + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
