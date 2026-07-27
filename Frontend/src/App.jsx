import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import Dashboard from './pages/Dashboard/Dashboard'
import CategoriaMateriales from './pages/Catalogos/CategoriaMateriales/CategoriaMateriales'
import UnidadesMedida from './pages/Catalogos/UnidadesMedida/UnidadesMedida'
import Materiales from './pages/Catalogos/Materiales/Materiales'
import Partidas from './pages/Catalogos/Partidas/Partidas'
import CostosUnitarios from './pages/Catalogos/CostosUnitarios/CostosUnitarios'
import Proyectos from './pages/Catalogos/Proyectos/Proyectos'
import CategoriasMO from './pages/Catalogos/CategoriasMO/CategoriasMO'
import IngresoDePrecios from './pages/IngresoDePrecios/IngresoDePrecios'
import CostosIndirectos from './pages/CostosIndirectos/CostosIndirectos'
import MiEmpresa from './pages/MiEmpresa/MiEmpresa'
import Usuarios from './pages/Usuarios/Usuarios'
import CostoUnitarioReporte from './pages/Reportes/CostoUnitarioReporte/CostoUnitarioReporte'
import AppLoading from './components/AppLoading/AppLoading'

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <AppLoading />
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />

        <Route element={<ProtectedRoute />}>
          <Route path="reportes/costo-unitario/:partidaId" element={<CostoUnitarioReporte />} />

          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="catalogos" element={<Navigate to="/catalogos/categoria-materiales" replace />} />
            <Route path="catalogos/categoria-materiales" element={<CategoriaMateriales />} />
            <Route path="catalogos/unidades-medida" element={<UnidadesMedida />} />
            <Route path="catalogos/materiales" element={<Materiales />} />
            <Route path="catalogos/partidas" element={<Partidas />} />
            <Route path="catalogos/partidas/:partidaId/costos-unitarios" element={<CostosUnitarios />} />
            <Route path="catalogos/proyectos" element={<Proyectos />} />
            <Route path="catalogos/categorias-mo" element={<CategoriasMO />} />

            <Route path="ingreso-de-precios" element={<IngresoDePrecios />} />
            <Route path="costos-indirectos" element={<CostosIndirectos />} />
            <Route path="mi-empresa" element={<MiEmpresa />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
