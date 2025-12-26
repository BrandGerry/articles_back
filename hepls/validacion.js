const validator = require("validator");

const validarArticulo = (res, parametros) => {
  if (
    !parametros.titulo ||
    !parametros.contenido ||
    !validator.isLength(parametros.titulo, { min: 5 })
  ) {
    return res.status(400).json({
      status: "error",
      mensaje: "Datos inválidos",
    });
  }
};

module.exports = {
  validarArticulo,
};
