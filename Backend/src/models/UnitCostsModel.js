import mongoose from "mongoose";

// Tb_Costos_Unitarios
const unitCostsSchema = new mongoose.Schema(
  {
    cantidad_material: {
      type: Number,
      required: true,
    },
    rendimiento: {
      type: Number,
    },
    calculo_precioU: {
      type: Number,
      required: true,
    },
    produccion_xdia: {
      type: Number,
    },
    factor_incremento: {
      type: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    codigo_m: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialsEquipment",
      required: true,
    },
    codigo_p: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partidas",
      required: true,
    },
    codigo_ci: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndirectCosts",
      required: true,
    },
    codigo_e: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    codigo_pu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UnitPrices",
      required: true,
    },
    codigo_proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    codigo_cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaborCategories",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UnitCosts", unitCostsSchema);
