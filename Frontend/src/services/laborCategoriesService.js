// GET/POST/PUT/DELETE /api/categorias-mo — LaborCategories: { descripcion, unidad, precio }.
// Global reference data, not company-scoped (matches Backend/src/models/LaborCategoriesModel.js).
import { createRestService } from './api'

export const laborCategoriesService = createRestService('/categorias-mo')
