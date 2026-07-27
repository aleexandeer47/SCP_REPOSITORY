// GET/POST/PUT/DELETE /api/admin — Admin (Tb_Usuarios): { usuario, contrasena, email, isAdmin }.
// Requires an authenticated admin; codigo_e is assigned server-side from
// the logged-in admin's own company (an admin can only manage users within
// their own company, never another one's).
import { createRestService } from './api'

export const adminUsersService = createRestService('/admin')
