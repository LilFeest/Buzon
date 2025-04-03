const sql = require('mssql');

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

module.exports = sql;