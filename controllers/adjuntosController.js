const sql = require('../config/dbconfig.js');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const adjuntosController = {
    /**
     * Obtiene los adjuntos de una queja como JSON
     */
    obtenerAdjuntos: async (req, res) => {
        try {
            const quejaId = req.params.id;

            // Validar que el ID sea un número válido
            if (!quejaId || isNaN(quejaId)) {
                return res.status(400).json({ 
                    error: 'ID de queja inválido',
                    details: `ID recibido: ${quejaId}`
                });
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
            
            if (!adjuntosRaw || adjuntosRaw.trim() === '') {
                return res.json(adjuntos); // Devuelve array vacío si no hay adjuntos
            }

            try {
                adjuntos = JSON.parse(adjuntosRaw);
                if (!Array.isArray(adjuntos)) {
                    throw new Error('Formato de adjuntos inválido, se esperaba un array');
                }
            } catch (e) {
                console.error(`Error al parsear adjuntos para queja ${quejaId}:`, e);
                return res.status(500).json({ 
                    error: 'Error al procesar los adjuntos',
                    details: process.env.NODE_ENV === 'development' ? e.message : undefined
                });
            }

            // Devolver los adjuntos como JSON
            res.json(adjuntos);

        } catch (error) {
            console.error(`Error al obtener adjuntos para queja ${req.params.id}:`, {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({ 
                error: 'Error al cargar los adjuntos',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Descarga un archivo adjunto específico
     */
    descargarAdjunto: async (req, res) => {
        try {
            const { quejaId, nombreGuardado } = req.params;

            // Validar parámetros
            if (!quejaId || isNaN(quejaId) || !nombreGuardado) {
                return res.status(400).json({ 
                    error: 'Parámetros inválidos',
                    details: {
                        quejaId: quejaId,
                        nombreGuardado: nombreGuardado
                    }
                });
            }

            // Consulta para verificar la queja y obtener los adjuntos
            const query = `
                SELECT adjuntos
                FROM [Buzon].[dbo].[queja]
                WHERE quejaId = @quejaId
            `;
            
            const result = await sql.query({
                text: query,
                values: { quejaId: parseInt(quejaId) }
            });

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Queja no encontrada' });
            }

            // Parsear los adjuntos
            let adjuntos = [];
            const adjuntosRaw = result.recordset[0].adjuntos;
            
            if (!adjuntosRaw || adjuntosRaw.trim() === '') {
                return res.status(404).json({ error: 'No hay adjuntos para esta queja' });
            }

            try {
                adjuntos = JSON.parse(adjuntosRaw);
                if (!Array.isArray(adjuntos)) {
                    throw new Error('Formato de adjuntos inválido, se esperaba un array');
                }
            } catch (e) {
                console.error(`Error al parsear adjuntos para queja ${quejaId}:`, e);
                return res.status(500).json({ 
                    error: 'Error al procesar los adjuntos',
                    details: process.env.NODE_ENV === 'development' ? e.message : undefined
                });
            }

            // Validar estructura de los adjuntos
            const isValidAdjunto = (adj) => adj && 
                typeof adj.nombreGuardado === 'string' &&
                typeof adj.nombreOriginal === 'string';
                
            if (!adjuntos.every(isValidAdjunto)) {
                return res.status(500).json({ error: 'Estructura de adjuntos inválida' });
            }

            // Buscar el archivo en los metadatos
            const adjunto = adjuntos.find(a => a.nombreGuardado === nombreGuardado);
            if (!adjunto) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en la queja',
                    details: `Nombre guardado: ${nombreGuardado}`
                });
            }

            // Ruta del archivo en el servidor
            const filePath = path.join(__dirname, '..', 'adjuntos', quejaId, nombreGuardado);

            // Verificar si el archivo existe
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ 
                    error: 'Archivo no encontrado en el servidor',
                    details: `Ruta: ${filePath}`
                });
            }

            // Determinar el tipo MIME
            const mimeType = mime.lookup(adjunto.nombreOriginal) || 'application/octet-stream';

            // Configurar encabezados para la descarga
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(adjunto.nombreOriginal)}"`);

            // Crear stream de lectura para manejar errores
            const fileStream = fs.createReadStream(filePath);
            
            fileStream.on('error', (err) => {
                console.error(`Error al leer el archivo ${filePath}:`, err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error al leer el archivo' });
                }
            });

            // Enviar el archivo
            fileStream.pipe(res);

        } catch (error) {
            console.error(`Error al descargar adjunto para queja ${req.params.quejaId}:`, {
                error: error.message,
                stack: error.stack,
                params: req.params
            });
            
            const statusCode = error.code === 'ENOENT' ? 404 : 500;
            const message = statusCode === 404 
                ? 'Archivo no encontrado en el servidor' 
                : 'Error al descargar el archivo';
                
            res.status(statusCode).json({ 
                error: message,
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = adjuntosController;
