const connection = require('../config/dbconfig');
const sql = require('mssql');

exports.agregarArea = async (req, res) => {
        try {
            // Seteando los valores del req.body
            const nombre = req.body.nombre;
            const abreviatura = req.body.abreviatura;
            const correo = req.body.correo;

            // Validación de campos obligatorios
            if (!nombre || !abreviatura) {
                return res.status(400).send('Faltan datos obligatorios (nombre y abreviatura)');
            }

            // Establecer conexión
            const pool = await sql.connect(connection);
            
            // Consulta SQL con parámetros
            const request = pool.request();
            request.input('nombre', sql.VarChar(30), nombre);
            request.input('abreviatura', sql.VarChar(5), abreviatura);
            request.input('correo', sql.VarChar(50), correo);

            await request.query(`
                INSERT INTO [Buzon].[dbo].[area] (nombre, abreviatura, correo)
                VALUES (@nombre, @abreviatura, @correo)
            `);
            
            // Redirección después de guardar
            res.redirect('/areas?success=true&message=Área registrada exitosamente');
            
            // El return no es necesario ya que se hace res.redirect
            return { success: true, message: 'Área registrada exitosamente' };
        } catch (error) {
            console.error('Error al registrar área:', error);
            res.status(500).send('Error en la base de datos');
        }
    };
    
    // ... (otras funciones del controlador)

//module.exports = areaController;

    /*// Obtener todas las áreas (útil para dropdowns)
    obtenerAreas: async () => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query('SELECT areaId as id, nombre FROM area ORDER BY nombre');
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener áreas:', error);
            throw new Error('Error al cargar las áreas');
        }
    }*/


//module.exports = areaController;