import mongoose from "mongoose";

// Tb_Proyecto
const projectSchema = new mongoose.Schema(
  {
    nombre_proyecto: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    cliente: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    codigo_e: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
