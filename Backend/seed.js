// Dev/demo seed script — safe to re-run (upserts by natural key instead of
// duplicating). Seeds two companies from different industries on purpose
// (construction + bakery) to prove the catalogs are genuinely per-company:
// same document structure (Equipo / Materiales / Mano de obra), completely
// different content.
//
// Usage: npm run seed   (from Backend/)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./src/config.js";

import Company from "./src/models/CompanyModel.js";
import Admin from "./src/models/AdminModel.js";
import MaterialCategories from "./src/models/MaterialCategoriesModel.js";
import UnitsMeasurement from "./src/models/UnitsMeasurementModel.js";
import MaterialsEquipment from "./src/models/MaterialsEquipmentModel.js";
import UnitPrices from "./src/models/UnitPricesModel.js";
import IndirectCosts from "./src/models/IndirectCostsModel.js";
import LaborCategories from "./src/models/LaborCategoriesModel.js";
import Project from "./src/models/ProjectModel.js";
import Partidas from "./src/models/PartidasModel.js";
import UnitCosts from "./src/models/UnitCostsModel.js";

await mongoose.connect(config.db.URI);

async function ensureCompany(nombre, nit) {
  let company = await Company.findOne({ nit });
  if (!company) company = await Company.create({ nombre, nit });
  return company;
}

async function ensureAdmin(usuario, email, password, codigo_e) {
  let admin = await Admin.findOne({ usuario });
  if (!admin) {
    const contrasena = await bcrypt.hash(password, 10);
    admin = await Admin.create({ usuario, contrasena, email, isAdmin: true, codigo_e });
  }
  return admin;
}

async function ensureOne(Model, filter, data) {
  let doc = await Model.findOne(filter);
  if (!doc) doc = await Model.create({ ...filter, ...data });
  return doc;
}

// ─── Empresa 1: construcción (CATECO) ──────────────────────────────────────

const cateco = await ensureCompany("CATECO S.A. DE C.V.", "06141205891012");
await ensureAdmin("katia", "katia@cateco-scp.com", "Katia1234", cateco._id);

const catConcreto = await ensureOne(MaterialCategories, { descripcion: "Concreto", codigo_e: cateco._id }, {});
const catHerramientas = await ensureOne(MaterialCategories, { descripcion: "Herramientas", codigo_e: cateco._id }, {});
const catTuberias = await ensureOne(MaterialCategories, { descripcion: "Tuberías", codigo_e: cateco._id }, {});
const catMaderas = await ensureOne(MaterialCategories, { descripcion: "Maderas", codigo_e: cateco._id }, {});
const catAcero = await ensureOne(MaterialCategories, { descripcion: "Acero y metales", codigo_e: cateco._id }, {});
const catElectrico = await ensureOne(MaterialCategories, { descripcion: "Eléctrico", codigo_e: cateco._id }, {});
const catSenalizacion = await ensureOne(MaterialCategories, { descripcion: "Señalización", codigo_e: cateco._id }, {});

const unKg = await ensureOne(UnitsMeasurement, { nombre: "Kilogramo", codigo_e: cateco._id }, { abreviatura: "kg" });
const unM3 = await ensureOne(UnitsMeasurement, { nombre: "Metro cúbico", codigo_e: cateco._id }, { abreviatura: "m3" });
const unLts = await ensureOne(UnitsMeasurement, { nombre: "Litro", codigo_e: cateco._id }, { abreviatura: "lts" });
const unMl = await ensureOne(UnitsMeasurement, { nombre: "Metro lineal", codigo_e: cateco._id }, { abreviatura: "ml" });
const unVaras = await ensureOne(UnitsMeasurement, { nombre: "Vara", codigo_e: cateco._id }, { abreviatura: "varas" });
await ensureOne(UnitsMeasurement, { nombre: "Unidad", codigo_e: cateco._id }, { abreviatura: "u" });
const unBolsa = await ensureOne(UnitsMeasurement, { nombre: "Bolsa", codigo_e: cateco._id }, { abreviatura: "bolsa" });
await ensureOne(UnitsMeasurement, { nombre: "Metro cuadrado", codigo_e: cateco._id }, { abreviatura: "m2" });
await ensureOne(UnitsMeasurement, { nombre: "Hora", codigo_e: cateco._id }, { abreviatura: "hrs" });

const matTuberia = await ensureOne(MaterialsEquipment, { descripcion: "Tubería de concreto diámetro 30", codigo_e: cateco._id }, { codigo_cm: catTuberias._id });
const matCemento = await ensureOne(MaterialsEquipment, { descripcion: "Cemento", codigo_e: cateco._id }, { codigo_cm: catConcreto._id });
const matArena = await ensureOne(MaterialsEquipment, { descripcion: "Arena", codigo_e: cateco._id }, { codigo_cm: catConcreto._id });
const matAgua = await ensureOne(MaterialsEquipment, { descripcion: "Agua", codigo_e: cateco._id }, { codigo_cm: catConcreto._id });
const matMadera = await ensureOne(MaterialsEquipment, { descripcion: "Madera", codigo_e: cateco._id }, { codigo_cm: catMaderas._id });
await ensureOne(MaterialsEquipment, { descripcion: "Varilla de acero N.4", codigo_e: cateco._id }, { codigo_cm: catAcero._id });
await ensureOne(MaterialsEquipment, { descripcion: "Cable eléctrico #12", codigo_e: cateco._id }, { codigo_cm: catElectrico._id });
await ensureOne(MaterialsEquipment, { descripcion: "Pintura de tráfico amarilla", codigo_e: cateco._id }, { codigo_cm: catSenalizacion._id });
const eqConcretera = await ensureOne(MaterialsEquipment, { descripcion: "Concretera manual", codigo_e: cateco._id }, { codigo_cm: catHerramientas._id });
const eqCamion = await ensureOne(MaterialsEquipment, { descripcion: "Camión de estaca", codigo_e: cateco._id }, { codigo_cm: catHerramientas._id });
const eqHerramientas = await ensureOne(MaterialsEquipment, { descripcion: "Herramientas varias", codigo_e: cateco._id }, { codigo_cm: catHerramientas._id });

const priceTuberia = await ensureOne(UnitPrices, { codigo_m: matTuberia._id, codigo_e: cateco._id }, { precio: 99.73, presentacion: 1, precio_unitario: 99.73, codigo_u: unMl._id });
await ensureOne(UnitPrices, { codigo_m: matCemento._id, codigo_e: cateco._id }, { precio: 7.65, presentacion: 1, precio_unitario: 7.65, codigo_u: unBolsa._id });
await ensureOne(UnitPrices, { codigo_m: matArena._id, codigo_e: cateco._id }, { precio: 43.0, presentacion: 1, precio_unitario: 43.0, codigo_u: unM3._id });
await ensureOne(UnitPrices, { codigo_m: matAgua._id, codigo_e: cateco._id }, { precio: 0.01, presentacion: 1, precio_unitario: 0.01, codigo_u: unLts._id });
await ensureOne(UnitPrices, { codigo_m: matMadera._id, codigo_e: cateco._id }, { precio: 3.13, presentacion: 1, precio_unitario: 3.13, codigo_u: unVaras._id });

await ensureOne(IndirectCosts, { codigo_m: matTuberia._id, codigo_e: cateco._id }, { precio: 20.3 });

const laborCaporal = await ensureOne(LaborCategories, { descripcion: "Caporal", codigo_e: cateco._id }, { unidad: "hora", precio: 2.5 });
const laborAlbanil = await ensureOne(LaborCategories, { descripcion: "Albañil", codigo_e: cateco._id }, { unidad: "hora", precio: 2.86 });
const laborAuxiliar = await ensureOne(LaborCategories, { descripcion: "Auxiliar", codigo_e: cateco._id }, { unidad: "hora", precio: 1.5 });
await ensureOne(LaborCategories, { descripcion: "Electricista", codigo_e: cateco._id }, { unidad: "hora", precio: 4.0 });

const projectVias = await ensureOne(
  Project,
  { nombre_proyecto: "Mantenimiento Rutinario del Grupo 4-1 de Vías Pavimentadas", codigo_e: cateco._id },
  { direccion: "Zona 4, El Salvador", cliente: "CATECO S.A. DE C.V." }
);

const partidaTuberia = await ensureOne(
  Partidas,
  { nombre_actividad: "Tubería de concreto de 30", codigo_e: cateco._id },
  { unidad_medida: "ml", cantidad_analizada: 1, codigo_proyecto: projectVias._id, produccion_xdia: 1, prestaciones_pct: 90 }
);
await ensureOne(Partidas, { nombre_actividad: "Excavación de zanjas", codigo_e: cateco._id }, { unidad_medida: "m3", cantidad_analizada: 12 });
await ensureOne(Partidas, { nombre_actividad: "Fundición de losa", codigo_e: cateco._id }, { unidad_medida: "m2", cantidad_analizada: 30 });

// Reproduces the reference "Desglose de Costo Unitario" example exactly:
// Equipo $569.47 + Materiales $175.81 + Mano de obra $166.02 = $911.30
const catecoLines = [
  { categoria: "equipo", codigo_m: eqConcretera._id, unidad: "hrs", cantidad: 1, rendimiento: 0.13, tarifa: 19.5 },
  { categoria: "equipo", codigo_m: eqCamion._id, unidad: "hrs", cantidad: 1, rendimiento: 0.13, tarifa: 53.0 },
  { categoria: "equipo", codigo_m: eqHerramientas._id, unidad: "u", cantidad: 1, rendimiento: 1, tarifa: 11.78 },
  { categoria: "material", codigo_m: matTuberia._id, codigo_pu: priceTuberia._id, unidad: "ml", cantidad: 1, tarifa: 99.73 },
  { categoria: "material", codigo_m: matCemento._id, unidad: "bolsa", cantidad: 3, tarifa: 7.65 },
  { categoria: "material", codigo_m: matArena._id, unidad: "m3", cantidad: 0.56, tarifa: 43.0 },
  { categoria: "material", codigo_m: matAgua._id, unidad: "lts", cantidad: 88, tarifa: 0.01 },
  { categoria: "material", codigo_m: matMadera._id, unidad: "varas", cantidad: 9, tarifa: 3.13 },
  { categoria: "mano_obra", codigo_cat: laborCaporal._id, unidad: "hora", cantidad: 1, rendimiento: 0.13, tarifa: 2.5 },
  { categoria: "mano_obra", codigo_cat: laborAlbanil._id, unidad: "hora", cantidad: 1, rendimiento: 0.13, tarifa: 2.86 },
  { categoria: "mano_obra", codigo_cat: laborAuxiliar._id, unidad: "hora", cantidad: 4, rendimiento: 0.13, tarifa: 1.5 },
];
for (const line of catecoLines) {
  await ensureOne(
    UnitCosts,
    { codigo_p: partidaTuberia._id, categoria: line.categoria, codigo_m: line.codigo_m, codigo_cat: line.codigo_cat, codigo_e: cateco._id },
    line
  );
}

// ─── Empresa 2: repostería (Dulce Miel) — misma estructura, otro rubro ─────

const dulceMiel = await ensureCompany("Repostería Dulce Miel", "06149999991012");
await ensureAdmin("repo.admin", "admin@reposteria-scp.com", "Repo1234", dulceMiel._id);

const catHarinas = await ensureOne(MaterialCategories, { descripcion: "Harinas", codigo_e: dulceMiel._id }, {});
const catLacteos = await ensureOne(MaterialCategories, { descripcion: "Lácteos", codigo_e: dulceMiel._id }, {});
const catEquipoReposteria = await ensureOne(MaterialCategories, { descripcion: "Repostería", codigo_e: dulceMiel._id }, {});
await ensureOne(MaterialCategories, { descripcion: "Decoración", codigo_e: dulceMiel._id }, {});

const unKgRepo = await ensureOne(UnitsMeasurement, { nombre: "Kilogramo", codigo_e: dulceMiel._id }, { abreviatura: "kg" });
const unUnidadRepo = await ensureOne(UnitsMeasurement, { nombre: "Unidad", codigo_e: dulceMiel._id }, { abreviatura: "u" });
await ensureOne(UnitsMeasurement, { nombre: "Litro", codigo_e: dulceMiel._id }, { abreviatura: "lts" });
await ensureOne(UnitsMeasurement, { nombre: "Docena", codigo_e: dulceMiel._id }, { abreviatura: "doc" });
await ensureOne(UnitsMeasurement, { nombre: "Hora", codigo_e: dulceMiel._id }, { abreviatura: "hrs" });

const matHarina = await ensureOne(MaterialsEquipment, { descripcion: "Harina de trigo", codigo_e: dulceMiel._id }, { codigo_cm: catHarinas._id });
const matAzucar = await ensureOne(MaterialsEquipment, { descripcion: "Azúcar refinada", codigo_e: dulceMiel._id }, { codigo_cm: catHarinas._id });
const matMantequilla = await ensureOne(MaterialsEquipment, { descripcion: "Mantequilla", codigo_e: dulceMiel._id }, { codigo_cm: catLacteos._id });
const matHuevos = await ensureOne(MaterialsEquipment, { descripcion: "Huevos", codigo_e: dulceMiel._id }, { codigo_cm: catLacteos._id });
const eqBatidora = await ensureOne(MaterialsEquipment, { descripcion: "Batidora industrial", codigo_e: dulceMiel._id }, { codigo_cm: catEquipoReposteria._id });
const eqHorno = await ensureOne(MaterialsEquipment, { descripcion: "Horno de convección", codigo_e: dulceMiel._id }, { codigo_cm: catEquipoReposteria._id });

await ensureOne(UnitPrices, { codigo_m: matHarina._id, codigo_e: dulceMiel._id }, { precio: 1.2, presentacion: 1, precio_unitario: 1.2, codigo_u: unKgRepo._id });
await ensureOne(UnitPrices, { codigo_m: matAzucar._id, codigo_e: dulceMiel._id }, { precio: 0.95, presentacion: 1, precio_unitario: 0.95, codigo_u: unKgRepo._id });
await ensureOne(UnitPrices, { codigo_m: matMantequilla._id, codigo_e: dulceMiel._id }, { precio: 3.4, presentacion: 1, precio_unitario: 3.4, codigo_u: unKgRepo._id });
await ensureOne(UnitPrices, { codigo_m: matHuevos._id, codigo_e: dulceMiel._id }, { precio: 3.0, presentacion: 30, precio_unitario: 0.1, codigo_u: unUnidadRepo._id });

const laborPastelero = await ensureOne(LaborCategories, { descripcion: "Pastelero", codigo_e: dulceMiel._id }, { unidad: "hora", precio: 3.0 });
const laborDecorador = await ensureOne(LaborCategories, { descripcion: "Decorador de pasteles", codigo_e: dulceMiel._id }, { unidad: "hora", precio: 3.5 });

const projectEventos = await ensureOne(
  Project,
  { nombre_proyecto: "Producción de pastelería para eventos", codigo_e: dulceMiel._id },
  { direccion: "San Salvador", cliente: "Eventos Dulce Miel" }
);

const partidaPastel = await ensureOne(
  Partidas,
  { nombre_actividad: "Pastel de tres leches (18 porciones)", codigo_e: dulceMiel._id },
  { unidad_medida: "u", cantidad_analizada: 1, codigo_proyecto: projectEventos._id, produccion_xdia: 4, prestaciones_pct: 50 }
);

const dulceMielLines = [
  { categoria: "equipo", codigo_m: eqBatidora._id, unidad: "hrs", cantidad: 1, rendimiento: 0.5, tarifa: 2.0 },
  { categoria: "equipo", codigo_m: eqHorno._id, unidad: "hrs", cantidad: 1, rendimiento: 0.75, tarifa: 3.5 },
  { categoria: "material", codigo_m: matHarina._id, unidad: "kg", cantidad: 1.5, tarifa: 1.2 },
  { categoria: "material", codigo_m: matAzucar._id, unidad: "kg", cantidad: 1.0, tarifa: 0.95 },
  { categoria: "material", codigo_m: matMantequilla._id, unidad: "kg", cantidad: 0.5, tarifa: 3.4 },
  { categoria: "material", codigo_m: matHuevos._id, unidad: "u", cantidad: 6, tarifa: 0.1 },
  { categoria: "mano_obra", codigo_cat: laborPastelero._id, unidad: "hora", cantidad: 1, rendimiento: 0.25, tarifa: 3.0 },
  { categoria: "mano_obra", codigo_cat: laborDecorador._id, unidad: "hora", cantidad: 1, rendimiento: 0.5, tarifa: 3.5 },
];
for (const line of dulceMielLines) {
  await ensureOne(
    UnitCosts,
    { codigo_p: partidaPastel._id, categoria: line.categoria, codigo_m: line.codigo_m, codigo_cat: line.codigo_cat, codigo_e: dulceMiel._id },
    line
  );
}

console.log("Listo.");
console.log(`  ${cateco.nombre} — usuario: katia / contraseña: Katia1234 — partida de ejemplo: "${partidaTuberia.nombre_actividad}"`);
console.log(`  ${dulceMiel.nombre} — usuario: repo.admin / contraseña: Repo1234 — partida de ejemplo: "${partidaPastel.nombre_actividad}"`);

await mongoose.disconnect();
