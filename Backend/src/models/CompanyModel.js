import mongoose from "mongoose";

// Tb_Empresas
const companySchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 70,
    },
    nit: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}-\d{6}-\d{3}-\d$/, "El NIT debe tener el formato 0000-000000-000-0"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Company", companySchema);
