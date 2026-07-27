
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import loginRoutes from "./src/routes/login.routes.js";
import logoutRoutes from "./src/routes/logout.routes.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import companyRoutes from "./src/routes/company.routes.js";
import unitsMeasurementRoutes from "./src/routes/unitsMeasurement.routes.js";
import materialCategoriesRoutes from "./src/routes/materialCategories.routes.js";
import materialsEquipmentRoutes from "./src/routes/materialsEquipment.routes.js";
import partidasRoutes from "./src/routes/partidas.routes.js";
import unitPricesRoutes from "./src/routes/unitPrices.routes.js";
import indirectCostsRoutes from "./src/routes/indirectCosts.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import laborCategoriesRoutes from "./src/routes/laborCategories.routes.js";
import unitCostsRoutes from "./src/routes/unitCosts.routes.js";
import templatesRoutes from "./src/routes/templates.routes.js";
import budgetsRoutes from "./src/routes/budgets.routes.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o curl) o cualquier localhost en desarrollo
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("No permitido por la política CORS de KAPRA"));
    },
    credentials: true,
  }),
);



app.use(cookieParser());
app.use(express.json());

app.use("/api/loginAdmin", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPasswordAdmin", recoveryPasswordRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/empresas", companyRoutes);
app.use("/api/unidades-medida", unitsMeasurementRoutes);
app.use("/api/categorias-materiales", materialCategoriesRoutes);
app.use("/api/materiales-equipos", materialsEquipmentRoutes);
app.use("/api/partidas", partidasRoutes);
app.use("/api/precios-unitarios", unitPricesRoutes);
app.use("/api/costos-indirectos", indirectCostsRoutes);
app.use("/api/proyectos", projectRoutes);
app.use("/api/categorias-mo", laborCategoriesRoutes);
app.use("/api/costos-unitarios", unitCostsRoutes);
app.use("/api/plantillas", templatesRoutes);
app.use("/api/presupuestos", budgetsRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejador de errores centralizado
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({ message: error.message || "Error interno del servidor" });
});

export default app;

