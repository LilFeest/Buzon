const sql = require('../config/dbconfig.js');

const adjuntosController = {
    
    obtenerAdjuntos: async (req, res) => {
        try {
            const quejaId = req.params.id;

            // Validar que el ID sea un número válido
            if (!quejaId || isNaN(quejaId)) {
                return res.status(400).json({ error: 'ID de queja inválido' });
            }

            // Consulta para obtener los adjuntos
            const query = `
                SELECT adjuntos
                FROM [Buzon].[dbo].[queja]
                WHERE quejaId = @quejaId
            `;
            
            const result = await sql.query({
                text: query,
                values: { quejaId: parseInt(quejaId) }
            });

            // Verificar si la queja existe
            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Queja no encontrada' });
            }

            // Procesar los adjuntos
            let adjuntos = [];
            const adjuntosRaw = result.recordset[0].adjuntos;
            if (adjuntosRaw && adjuntosRaw !== '') {
                try {
                    adjuntos = JSON.parse(adjuntosRaw);
                } catch (e) {
                    console.error(`Error al parsear adjuntos para queja ${quejaId}:`, e);
                    return res.status(500).json({ error: 'Error al procesar los adjuntos' });
                }
            }

            // Devolver los adjuntos como JSON
            res.json(adjuntos);

        } catch (error) {
            console.error(`Error al obtener adjuntos para queja ${req.params.id}:`, error);
            res.status(500).json({ error: 'Error al cargar los adjuntos' });
        }
    }
};

module.exports = adjuntosController;