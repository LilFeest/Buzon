const sql = require('../config/dbconfig.js');

const reporteController = {
    /**
     * Muestra el reporte de quejas en tabla simple
     */
    mostrarReporte: async (req, res) => {
        try {
            const query = `
                SELECT 
                    q.quejaId as id,
                    q.quejaTitulo as titulo,
                    a.nombre as area,
                    q.contenido,
                    FORMAT(q.fechaIn, 'dd/MM/yyyy HH:mm') as fecha,
                    q.estado,
                    q.adjuntos,
                    q.nota
                FROM [Buzon].[dbo].[queja] q
                LEFT JOIN [Buzon].[dbo].[area] a ON q.areaId = a.areaId
                ORDER BY q.fechaIn DESC
            `;
            
            const result = await sql.query(query);
            
            // Procesar las quejas para asegurar que adjuntos sea un arreglo
            const quejas = result.recordset.map(queja => {
                let adjuntos = [];
                if (queja.adjuntos && queja.adjuntos.trim() !== '') {
                    try {
                        adjuntos = JSON.parse(queja.adjuntos);
                    } catch (e) {
                        console.error(`Error al parsear adjuntos para queja ${queja.id}:`, e);
                    }
                }
                return {
                    ...queja,
                    adjuntos // Mantenemos el JSON completo
                };
            });

            res.render('reporte', {
                titulo: 'Reporte de Quejas',
                quejas,
                fechaGeneracion: new Date().toLocaleString('es-MX')
            });
            
        } catch (error) {
            console.error('Error en reporteController:', error);
            res.status(500).render('error', {
                mensaje: 'Error al generar el reporte'
            });
        }
    }
};

module.exports = reporteController;