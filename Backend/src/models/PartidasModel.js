import mongoose from "mongoose";

// Tb_Partidas
const partidasSchema = new mongoose.Schema(
  {
    nombre_actividad: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
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
    // "Datos generales" for the Desglose de Costo Unitario report — optional,
    // filled in from the Costos Unitarios screen rather than the Partida form.
    codigo_proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    produccion_xdia: {
      type: Number,
    },
    prestaciones_pct: {
      type: Number,
    },
    fecha: {
      type: String,
      trim: true,
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
