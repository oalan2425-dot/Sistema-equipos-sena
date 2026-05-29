console.log("DB EJECUTADO");

const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tabaco2425@",
    database: "sistema_equipos"
});

conexion.connect((error) => {
    if (error) {
        console.log("error de conexion:",error);
    } else {
        console.log("conectado a MySQL");
    }
});

module.exports = conexion;
