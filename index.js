const { Client } = require('pg');

const config = {
    user: 'felipe',
    host: 'localhost',
    database: 'alwaysMusic',
    password: '123456',
    port: 5432,
}

const client = new Client(config);

client.connect();

let nombre, rut, curso, nivel;
const argumentos = process.argv.slice(2);
let comando = argumentos[0];

//Funcion para registrar un nuevo alumno, recibe como parametros los argumentos que envia el case "nuevo".
const nuevo = (nombre, rut, curso, nivel) => {
    return new Promise((resolve, reject) => {
        client.query(`INSERT INTO alumnos(nombre, rut, curso, nivel) values('${nombre}', '${rut}', '${curso}', '${nivel}') RETURNING *;`, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
            console.log("Iniciando la conexión...");
            client.end();
        })
    })
}

//Funcion para consultar todos los alumnos registrados.
const consulta = () => {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM alumnos;", (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
            console.log("Iniciando la conexión...");
            client.end();
        })
    })
}

//Funcion para actualizar la informacion de un alumno.
//el primer dato que debe recibir es el id que debe ser escrito en la consola
const editar = (id, nombre, rut, curso, nivel) => {
    return new Promise((resolve, reject) => {
        client.query(`UPDATE alumnos SET nombre='${nombre}', rut='${rut}', curso='${curso}', nivel='${nivel}' WHERE id=${id} RETURNING *;`, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
            console.log("Iniciando la conexión...");
            client.end();
        })
    })
}

//Funcion para consultar los datos de un alumno utilizando su rut.
//no puedo escribir la funcion como rut ya que existe una variable con ese mismo nombre.
const consultarPorRut = (rut) => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM alumnos WHERE rut = '${rut}';`, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
            console.log("Iniciando la conexión...");
            client.end();
        })
    })
}

//Funcion para eliminar los datos de un alumno mediante su rut.
const eliminar = (rut) => {
    return new Promise((resolve, reject) => {
        client.query(`DELETE FROM alumnos WHERE rut = '${rut}' RETURNING *;`, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
            console.log("Iniciando la conexión...");
            client.end();
        })
    })
}

switch (comando) {
    case 'nuevo':
        nombre = argumentos[1];
        rut = argumentos[2];
        curso = argumentos[3];
        nivel = argumentos[4];

        nuevo(nombre, rut, curso, nivel)
        .then(res => console.log(`Estudiante ${nombre} agregado con exito.`, res.rows))
        .catch(error =>console.log(`Error al insertar alumno en la BD`, error));
    break;

    case 'consulta':

        consulta()
        .then(res => console.log(`Registro actual:`, res.rows))
        .catch(error =>console.log(`Error al consultar la informacion de la BD`, error));
    break;

    case 'editar':
        id = argumentos[1];
        nombre = argumentos[2];
        rut = argumentos[3];
        curso = argumentos[4];
        nivel = argumentos[5];

        editar(id, nombre, rut, curso, nivel)
        .then(res => console.log(`Estudiante ${nombre} editado con exito.`, res.rows))
        .catch(error =>console.log(`Error al actualizar alumno en la BD`, error));
    break;

    case 'consultarPorRut':
        rut = argumentos[1];

        consultarPorRut(rut)
        .then(res => console.log(`Consulta por Rut:`, res.rows))
        .catch(error =>console.log(`Error al consultar la informacion de la BD`, error));
    break;

    case 'eliminar':
        rut = argumentos[1];

        eliminar(rut)
        .then(res => console.log(`Registro de estudiante con Rut ${rut} eliminado`, res.rows))
        .catch(error =>console.log(`Error al consultar la informacion de la BD`, error));
    break;

    default:
        console.log("Se ha ingresado una opcion incorrecta!")
    break;
}

/**
 * para ejecutar el programa se debe escribir en la consola alguna de estas opciones
 * > node index.js nuevo 'Felipe Munoz' 17.819.597-2 Guitarra 2
 * > node index.js consulta
 * > node index.js editar 1 'Felipe Munoz' 17.819.597-2 Acordeon 10
 * > node index.js consultarPorRut '17.819.597-2'
 * > node index.js eliminar '17.819.597-2'
 */