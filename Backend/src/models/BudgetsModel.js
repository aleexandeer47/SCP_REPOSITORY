import mongoose from "mongoose";

// Tb_Presupuestos
const budgetsSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
    total_iva: {
      type: Number,
      required: true,
    },
    codigo_proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    codigo_e: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    codigo_cu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UnitCosts",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Budgets", budgetsSchema);
