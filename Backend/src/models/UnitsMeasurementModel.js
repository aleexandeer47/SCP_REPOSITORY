import mongoose from "mongoose";

// Tb_Unidades_Medida
const unitsMeasurementSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    abreviatura: {
      type: String,
      trim: true,
      maxlength: 5,
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

export default mongoose.model("UnitsMeasurement", unitsMeasurementSchema);
