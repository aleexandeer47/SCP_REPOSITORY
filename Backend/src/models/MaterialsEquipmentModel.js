import mongoose from "mongoose";

// Tb_Materiales_Equipos
const materialsEquipmentSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    codigo_cm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialCategories",
      required: true,
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

export default mongoose.model("MaterialsEquipment", materialsEquipmentSchema);
