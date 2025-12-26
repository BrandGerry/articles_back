const express = require("express");
const router = express.Router();
const multer = require("multer");

const ArticuloController = require("../controladores/Articulo.js");
const almacenamineto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imagenes/articulos");
  },
  filename: (req, file, cb) => {
    cb(null, "articulo" + Date.now() + file.originalname);
  },
});

const subidas = multer({ storage: almacenamineto });

//RUTAS DE PRUEBAS
router.get("/ruta-de-prueba", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);
//RUTA UTIL
router.post("/crear", ArticuloController.crear);
//Pasar parametro de manera obligatorio :parametro u opcional :parametro?
router.get("/articulos", ArticuloController.listar);
router.get("/articulos/:parametro", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.uno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);
router.post(
  "/subirImagen/:id",
  [subidas.single("file")],
  ArticuloController.subir
);
router.get("/imagen/:fichero", ArticuloController.imagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;
