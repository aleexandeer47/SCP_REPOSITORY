import mongoose from "mongoose";

// Tb_Partidas
const partidasSchema = new mongoose.Schema(
  {
    nombre_actividad: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    unidad_medida: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
    cantidad_analizada: {
      type: Number,
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

export default mongoose.model("Partidas", partidasSchema);
