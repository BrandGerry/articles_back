const { conection } = require("./database/conection");
const express = require("express");
const cors = require("cors");

//INICIAR LA APP
console.log("App de node arrancada");
//CONECTAR LA BASE DE DATOS
conection();
//CREAR SERVIDOR NODE
const app = express();
const port = 3900;
//CONFIGURAR CORS
app.use(cors());
//CONVERTIR BODY A OBJ JS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS
const rutas_articulo = require("./rutas/articulo");

//CARGO LAS RUTAS
app.use("/api", rutas_articulo);

//RUTAS PRUEBAS HARCODEADAS
app.get("/", (req, res) => {
  return res.status(200).json({
    curso: "SQL",
    nombre: "Brandon Mercado",
    url: ".com.mx",
  });
});

app.get("/probando", (req, res) => {
  console.log("Se ha ejecutado el endpoint");
  return res.status(200).send(`
    <div>
    <h1>Probando la ruta</h1>
    </div>
    `);
});
//CREAR SERVIDOR Y ESCUCHAR PETICIONES EN EL PUERTO
app.listen(port, () => console.log(`Puerto corriendo ${port}`));
