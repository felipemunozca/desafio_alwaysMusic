/**
 * iniciar el proyecto con npm
 * > npm init -y
 * 
 * instalar el paquete pg
 * > npm i pg
 * 
 * levantar el programa por consola
 * > node index.js
 */

const { Client } = require('pg');

//METODO DE CONEXION MEDIANTE OBJETO DE CONEXION.
const config = {
    user: 'felipe',
    host: 'localhost', //'127.0.0.1' ip de loopback
    database: 'alwaysMusic',
    password: '123456',
    port: 5432,
}

//INSTANCIO EL OBJETO DE CONEXION.
const client = new Client(config);

//METODO PARA CONECTARSE A LA BASE DE DATOS.
client.connect();

//CREAR LA BASE DE DATOS
/* 
CREATE DATABASE alwaysMusic;
*/

//CREAR LA TABLA ALUMNOS
/*
CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR (50) NOT NULL,
    rut VARCHAR (15) NOT NULL,
    curso VARCHAR (30) NOT NULL,
    nivel VARCHAR (10) NOT NULL
);
*/

//VARIABLES GENERALES A UTILIZAR.
//declarar asi las variables es lo mismo que igualarlas a vacio -> let nombre = "";
let nombre, rut, curso, nivel;

//Se quitan los primeros dos argumentos (ruta del archivo) que trae argv mediante el metodo slice (cortar).
const argumentos = process.argv.slice(2);
//Ahora se empieza a contar la variable argumento desde la posicion cero.
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
         //se crean los argumentos que se enviaran a la consulta SQL, comienzan desde la posicion 1 en el mismo orden que se reciben los datos en la funcion.
        nombre = argumentos[1];
        rut = argumentos[2];
        curso = argumentos[3];
        nivel = argumentos[4];

        //como la funcion "nuevo" es una promesa, para mostrar la respuesta y manejar los errores, se utiliza .then() y .catch() 
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

     //En el caso en que no se ingrese ninguna opcion de las declaradas en los case. Se ejecutara el codigo por defecto.
    default:
        console.log("Se ha ingresado una opcion incorrecta!")
    break;
}

/**
  * para ejecutar el programa se debe escribir en la consola alguna de estas opciones
  * > node index.js nuevo 'Felipe Munoz' 17.819.597-2 Guitarra 2
  * > node index.js consulta
  * > node index.js editar 3 'Felipe Munoz' 17.819.597-2 Acordeon 10
  * > node index.js consultarPorRut '17.819.597-2'
  * > node index.js eliminar '17.819.597-2'
  */