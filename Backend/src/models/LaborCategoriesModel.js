import mongoose from "mongoose";

// Tb_Cat_MO (categorías de mano de obra)
const laborCategoriesSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    unidad: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    precio: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LaborCategories", laborCategoriesSchema);
