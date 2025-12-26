const { validarArticulo } = require("../hepls/validacion");
const fs = require("fs");
const path = require("path");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    msg: "Soy una accion.",
  });
};

const curso = (req, res) => {
  console.log("Se ha ejecutado el endpoint");
  return res.status(200).send(`
    <div>
    <h1>Probando la ruta</h1>
    </div>
    `);
};

const crear = async (req, res) => {
  const { titulo, contenido } = req.body;
  const parametros = req.body;

  // VALIDACIÓN (sin try/catch)
  validarArticulo(res, parametros);

  try {
    const articulo = new Articulo({ titulo, contenido });
    const articuloSave = await articulo.save();

    return res.status(200).json({
      status: "success",
      articulo: articuloSave,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al guardar el artículo",
      error: error.message,
    });
  }
};

const listar = async (req, res) => {
  try {
    const { parametro } = req.params;
    //FUNCIONALIDA DE TRAER LOS ARTICULOS
    let articulos;

    if (parametro) {
      articulos = await Articulo.find({}).limit(1).sort({ fecha: -1 });
    } else {
      articulos = await Articulo.find({}).sort({ fecha: -1 });
    }

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos.",
      });
    }

    return res.status(200).json({
      status: "success",
      articulos,
      mensaje: "Artículos",
      contador: articulos.length,
      parametro,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al obtener los artículos.",
      error: error.message,
    });
  }
};

const uno = async (req, res) => {
  try {
    const { id } = req.params;
    //FUNCIONALIDA DE TRAER LOS ARTICULOS
    const articulo = await Articulo.findById(id);

    if (!articulo || articulo.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos.",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo,
      mensaje: "Artículos",
      id,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al obtener los artículos.",
      error: error.message,
    });
  }
};

const borrar = async (req, res) => {
  try {
    const { id } = req.params;
    //FUNCIONALIDA DE TRAER LOS ARTICULOS
    const articulo = await Articulo.findOneAndDelete({ _id: id });

    if (!articulo || articulo.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "Articulo borrado incorrectactemente.",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo,
      mensaje: "Articulo Borrado yes",
      id,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "ERROR",
      error: error.message,
    });
  }
};

const editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
    const parametros = req.body;

    // VALIDACIÓN (sin try/catch)
    validarArticulo(res, parametros);

    const articulo = await Articulo.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      articulo,
      mensaje: "Articulo Actuaizado yes",
      id,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "ERROR",
      error: error.message,
    });
  }
};

const subir = async (req, res) => {
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion invalida",
    });
  }
  try {
    const archivo = req.file.originalname;
    const archivoSplit = archivo.split(".");
    const archivoExt = archivoSplit[1];

    if (
      archivoExt !== "jpg" &&
      archivoExt !== "png" &&
      archivoExt !== "gift" &&
      archivoExt !== "jpeg"
    ) {
      fs.unlink(req.file.path, (error) => {
        return res.status(400).json({
          status: "error",
          mensaje: "Error no es una imagen",
        });
      });
    } else {
      const { id } = req.params;

      const archivoImg = await Articulo.findOneAndUpdate(
        { _id: id },
        { imagen: req.file.filename },
        {
          new: true,
        }
      );

      return res.status(200).json({
        status: "success",
        mensaje: "Subida exitosa",
        file: archivoExt,
        imgaAct: archivoImg,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "ERROR",
      error: error.message,
    });
  }
};

const imagen = async (req, res) => {
  let fichero = req.params.fichero;
  let rutaFisica = "./imagenes/articulos/" + fichero;

  fs.stat(rutaFisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(rutaFisica));
    } else {
      res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        error: error.message,
      });
    }
  });
};

const buscador = async (req, res) => {
  let busqueda = req.params.busqueda;
  const search = await Articulo.find({
    $or: [
      { titulo: { $regex: busqueda, $options: "i" } },
      { contenido: { $regex: busqueda, $options: "i" } },
    ],
  }).sort({ fecha: -1 });

  if (search && search.length > 0) {
    res.status(200).json({
      status: "success",
      mensaje: "LA NETA DEL PLANETA",
      search,
    });
  } else {
    res.status(404).json({
      status: "error",
      mensaje: "La imagen no existe",
    });
  }
};

module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};
