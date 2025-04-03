const { poolPromise, sql } = require('../config/dbconfig');

const areaController = {
    // Agregar nueva área a la base de datos
    agregarArea: async (areaData) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('nombre', sql.VarChar(30), areaData.nombre)
                .input('abreviatura', sql.VarChar(5), areaData.abreviatura)
                .input('correo', sql.VarChar(50), areaData.correo)
                .query(`
                    INSERT INTO area (nombre, abreviatura, correo)
                    VALUES (@nombre, @abreviatura, @correo)
                `);
            console.log(result);
            return { success: true, message: 'Área registrada exitosamente' };
        } catch (error) {
            console.error('Error al registrar área:', error);
            throw new Error('Error al guardar el área en la base de datos');
        }
    },

    // Obtener todas las áreas (útil para dropdowns)
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
    }
};

module.exports = areaController;