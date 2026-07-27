// GET/POST/PUT/DELETE /api/categorias-materiales — MaterialCategories: { descripcion }.
// codigo_e is assigned server-side from the logged-in admin's company.
import { createRestService } from './api'

export const materialCategoriesService = createRestService('/categorias-materiales')
