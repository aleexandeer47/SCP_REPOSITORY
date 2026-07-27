import mongoose from "mongoose";

// Tb_Categorias_Materiales
const materialCategoriesSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
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

export default mongoose.model("MaterialCategories", materialCategoriesSchema);
