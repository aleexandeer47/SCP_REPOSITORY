import mongoose from "mongoose";

// Tb_Costos_Indirectos
const indirectCostsSchema = new mongoose.Schema(
  {
    precio: {
      type: Number,
      required: true,
    },
    codigo_m: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialsEquipment",
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

export default mongoose.model("IndirectCosts", indirectCostsSchema);
