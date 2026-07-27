// GET/POST/PUT/DELETE /api/proyectos — Project: { nombre_proyecto, direccion, cliente }.
// codigo_e is assigned server-side from the logged-in admin's company.
import { createRestService } from './api'

export const projectService = createRestService('/proyectos')
