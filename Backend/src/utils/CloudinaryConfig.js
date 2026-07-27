import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../config.js";

/*
  Configuración de Cloudinary.
  Aquí conectamos con la API de Cloudinary usando las credenciales cargadas de nuestras
  variables de entorno (nombre de la nube, llave y secreto).
*/
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

/*
  Definimos el almacenamiento utilizando CloudinaryStorage.
  Le indicamos que guarde las imágenes subidas en la carpeta "SCP" dentro de nuestra cuenta de Cloudinary,
  y limitamos los formatos permitidos a imágenes comunes.
*/
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SCP",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

/*
  Instanciamos Multer con la configuración de almacenamiento de Cloudinary que creamos arriba.
  Este middleware (`upload`) lo podemos usar directamente en las rutas cuando queramos
  recibir archivos de parte del cliente y subirlos automáticamente a la nube.
*/
const upload = multer({ storage });

export default upload;
