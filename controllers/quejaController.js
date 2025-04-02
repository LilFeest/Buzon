const { poolPromise, sql } = require('../config/dbconfig');

const quejaController = {
    // Agregar nueva queja a la base de datos
    agregarQueja: async (quejaData) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('quejaTitulo', sql.VarChar(80), quejaData.titulo)
                .input('areaId', sql.Int, quejaData.area_id)
                .input('contenido', sql.VarChar(500), quejaData.contenido)
                .query(`
                    INSERT INTO quejas (quejaTitulo, areaId, contenido)
                    VALUES (@quejaTitulo, @areaId, @contenido)
                `);
            
            return { success: true, message: 'Queja enviada exitosamente' };
        } catch (error) {
            console.error('Error al registrar queja:', error);
            throw new Error('Error al guardar la queja en la base de datos');
        }
    },

    // Obtener todas las áreas para el dropdown
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

module.exports = quejaController;