import mongoose from "mongoose";

// Tb_Proyecto
const projectSchema = new mongoose.Schema(
  {
    nombre_proyecto: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    cliente: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
