import mongoose from "mongoose";

// Tb_Precios_Unitarios
const unitPricesSchema = new mongoose.Schema(
  {
    precio: {
      type: Number,
      required: true,
    },
    presentacion: {
      type: Number,
      required: true,
    },
    precio_unitario: {
      type: Number,
      required: true,
    },
    codigo_m: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialsEquipment",
      required: true,
    },
    codigo_u: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UnitsMeasurement",
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

export default mongoose.model("UnitPrices", unitPricesSchema);
