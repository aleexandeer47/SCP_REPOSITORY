import mongoose from "mongoose";

// Tb_Usuarios (codigo_rol se reemplaza por el flag isAdmin, no existe colección de roles)
const adminSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 70,
      unique: true,
    },
    contrasena: {
      type: String,
      required: true,
    },
    // Correo de contacto usado para la recuperación de contraseña
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    codigo_e: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // Foto de perfil almacenada en Cloudinary
    image_url: {
      type: String,
      default: null,
    },
    public_id: {
      type: String,
      default: null,
    },
    // Contador de intentos fallidos de login para prevenir ataques de fuerza bruta
    loginAttempts: {
      type: Number,
      default: 0,
    },
    // Marca de tiempo que bloquea la cuenta temporalmente si se superan los intentos fallidos
    timeOut: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", adminSchema);
