import mongoose from "mongoose";

// Tb_Costos_Unitarios
// One row of a Partida's "Desglose de Costo Unitario": either an equipo,
// material, or mano_obra line. Which refs are required depends on
// `categoria` — enforced in unitCostsController, not here, since a single
// mongoose `required` can't be conditional on a sibling field cleanly.
const unitCostsSchema = new mongoose.Schema(
  {
    categoria: {
      type: String,
      enum: ["equipo", "material", "mano_obra"],
      required: true,
    },
    codigo_p: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partidas",
      required: true,
    },
    // Equipo / material only.
    codigo_m: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaterialsEquipment",
    },
    // Material only — the Ingreso de precios record this line's tarifa came from.
    codigo_pu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UnitPrices",
    },
    // Mano de obra only.
    codigo_cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaborCategories",
    },
    unidad: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    // Not used for materiales (their Valor is cantidad x tarifa directly).
    rendimiento: {
      type: Number,
    },
    // Precio Unitario (material) / Valor Hora (equipo) / Salario por Hora (mano_obra).
    tarifa: {
      type: Number,
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

export default mongoose.model("UnitCosts", unitCostsSchema);
