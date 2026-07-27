import mongoose from "mongoose";

// Tb_Empresas
const companySchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 70,
    },
    nit: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", companySchema);
