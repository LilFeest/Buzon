/*const sql = require('mssql');

const config = {
    user: "APPLOG01",
    password: "DataStore2023.0801",
    server: "192.168.1.16\\CNSCSQL001",
    database: "buzon",
    options: {
        encrypt:true,
        trustServerCertificate: true
    }
}

// Crear un pool de conexiones reusable
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conexión exitosa a la base de datos');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        throw err; // Propaga el error para que lo capturen los controladores
    });

async function connectToDB() {
    try {
        await sql.connect(config);
        console.log('Conexión exitosa a la base de datos');
        // Puedes realizar consultas u otras operaciones aquí
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

connectToDB();


// No estamos ejecutando ninguna consulta en este ejemplo
module.exports = {sql, poolPromise};*/