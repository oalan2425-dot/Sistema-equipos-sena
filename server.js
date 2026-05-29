const express = require("express");
const path = require("path");
const conexion = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {

    const { usuario, password } = req.body;

    const sql =
    "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";

    conexion.query(sql, [usuario, password], (error, resultados) => {

        if (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                mensaje: "Error del servidr"
            });
        } else if (resultados.length > 0) {

            res.json({
                success: true,
                mensaje: "Login correcto"
            });
        } else {

            res.status(401).json({
                success: false,
                mensaje: "Usuario o contraseña incorrectos"
            });
        }
    });
});

app.post("/guardar-registro", (req, res) =>{

console.log(req.body);

    const datos = req.body;

    const sql =
    `INSERT INTO registros (
        nombre,
        jornada,
        formacion,
        ficha,
        tipoequipo,
        equipo,
        mouse,
        serialmouse,
        cargador,
        serialcargador,
        teclado,
        serialteclado,
        fecha,
        inicio,
        fin,
        estado,
        observaciones
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const valores = [
        datos.nombre,
        datos.jornada,
        datos.formacion,
        datos.ficha,
        datos.tipoequipo,
        datos.equipo,
        datos.mouse,
        datos.serialmouse,
        datos.cargador,
        datos.serialcargador,
        datos.teclado,
        datos.serialteclado,
        datos.fecha,
        datos.inicio,
        datos.fin,
        datos.estado,
        datos.observaciones
    ];

    conexion.query(sql, valores, (error, resultado) => {

        if (error) {
            console.log(error);
            res.status(500).json({
                mensaje: "Error al guardar"
            });
        } else {

            console.log("REGISTRO GUARDADO");

            res.json({
                mensaje: "Registro guardado correctamente"
            });
        }
    });
});

app.get("/obtener-registros", (req, res) => {

    const sql = "SELECT * FROM registros";

    conexion.query(sql, (error, resultados) => {

        if (error) {
            console.log(error);

            res.status(500).json({
                mensaje: "Error al obtener registros"
            });
        } else {
            res.json(resultados);
        }
    });
});

app.delete("/eliminar-registro/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM registros WHERE id = ?";

    conexion.query(sql, [id], (error, resultado) => {

        if (error) {

            console.log(error);

            res.status(500).json({
                sucess: false,
                mensaje: "Error al eliminar"
            });

        } else {

            res.json({
                sucess: true,
                mensaje: "Registro eliminado"
            });
        }
    });
});


app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});