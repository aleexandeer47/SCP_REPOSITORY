import Partidas from "../models/PartidasModel.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getPartidas = catchAsync(async (req, res) => {
  const partidas = await Partidas.find().populate("codigo_e");
  res.json(partidas);
});

export const getPartida = catchAsync(async (req, res) => {
  const partida = await Partidas.findById(req.params.id).populate("codigo_e");
  if (!partida) {
    return res.status(404).json({ message: "Partida no encontrada" });
  }
  res.json(partida);
});

export const createPartida = catchAsync(async (req, res) => {
  const { nombre_actividad, unidad_medida, cantidad_analizada, codigo_e } = req.body;
  const newPartida = new Partidas({
    nombre_actividad,
    unidad_medida,
    cantidad_analizada,
    codigo_e,
  });
  const partidaSaved = await newPartida.save();
  res.status(201).json(partidaSaved);
});

export const updatePartida = catchAsync(async (req, res) => {
  const { nombre_actividad, unidad_medida, cantidad_analizada, codigo_e } = req.body;
  const updatedPartida = await Partidas.findByIdAndUpdate(
    req.params.id,
    { nombre_actividad, unidad_medida, cantidad_analizada, codigo_e },
    { new: true }
  );
  if (!updatedPartida) {
    return res.status(404).json({ message: "Partida no encontrada" });
  }
  res.json(updatedPartida);
});

export const deletePartida = catchAsync(async (req, res) => {
  const deletedPartida = await Partidas.findByIdAndDelete(req.params.id);
  if (!deletedPartida) {
    return res.status(404).json({ message: "Partida no encontrada" });
  }
  res.status(204).end();
});
