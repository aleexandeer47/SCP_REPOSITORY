// Importamos la librería de Mongoose para interactuar con MongoDB
import mongoose from "mongoose";
// Cargamos la configuración para obtener la URI de conexión
import { config } from "./src/config.js";

// Conectamos a la base de datos usando la URI especificada en la configuración
mongoose.connect(config.db.URI);

const connection = mongoose.connection;

// Evento único para cuando la conexión se abre de manera exitosa
connection.once("open", ()=>{
    console.log("Conectada exitosamente a la base de datos")
})

// Evento para cuando la base de datos se desconecta de imprevisto
connection.on("disconnected", (error)=>{
    console.log("Base de datos desconectada: " + error)
})

// Evento para manejar cualquier error que surja en la conexión
connection.on("error", (error)=>{
    console.log("Error detectado en la conexión: " + error)
})
