import Partidas from "../models/PartidasModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const populateRefs = (query) => query.populate("codigo_e").populate("codigo_proyecto");

export const getPartidas = catchAsync(async (req, res) => {
  const partidas = await populateRefs(Partidas.find({ codigo_e: req.user.codigo_e }));
  res.json(partidas);
});

export const getPartida = catchAsync(async (req, res) => {
  const partida = await populateRefs(Partidas.findOne({ _id: req.params.id, codigo_e: req.user.codigo_e }));
  if (!partida) {
    return res.status(404).json({ message: "Partida no encontrada" });
  }
  res.json(partida);
});

export const createPartida = catchAsync(async (req, res) => {
  const { nombre_actividad, unidad_medida, cantidad_analizada, codigo_proyecto, produccion_xdia, prestaciones_pct, fecha } = req.body;
  const newPartida = new Partidas({
    nombre_actividad,
    unidad_medida,
    cantidad_analizada,
    codigo_proyecto: codigo_proyecto || undefined,
    produccion_xdia,
    prestaciones_pct,
    fecha,
    codigo_e: req.user.codigo_e,
  });
  const partidaSaved = await newPartida.save();
  res.status(201).json(await populateRefs(Partidas.findById(partidaSaved._id)));
});

export const updatePartida = catchAsync(async (req, res) => {
  const { nombre_actividad, unidad_medida, cantidad_analizada, codigo_proyecto, produccion_xdia, prestaciones_pct, fecha } = req.body;
  const updatedPartida = await Partidas.findOneAndUpdate(
    { _id: req.params.id, codigo_e: req.user.codigo_e },
    {
      nombre_actividad,
      unidad_medida,
      cantidad_analizada,
      codigo_proyecto: codigo_proyecto || undefined,
      produccion_xdia,
      prestaciones_pct,
      fecha,
    },
    { new: true, runValidators: true }
  );
  if (!updatedPartida) {
    return res.status(404).json({ message: "Partida no encontrada" });
  }
  res.json(await populateRefs(Partidas.findById(updatedPartida._id)));
});

export const deletePartida = catchAsync(async (req, res) => {
  const deletedPartida = await Partidas.findOneAndDelete({ _id: req.params.id, codigo_e: req.user.codigo_e });
  if (!deletedPartida) {
    return res.status(404).json({ message: "Partida no encontrada" });
  }
  res.status(204).end();
});
