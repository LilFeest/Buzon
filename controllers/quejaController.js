const sql = require('mssql');
const connection = require('../config/dbconfig');
const fs = require('fs');
const path = require('path');

exports.guardarqueja = async (req, res) => {
  let pool;
  try {
    // Validar campos obligatorios
    const { titulo, area_id, contenido } = req.body;
    if (!titulo || !area_id) {
      // Limpiar archivos temporales si la validación falla
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).redirect('/quejas?success=false&message=Faltan datos obligatorios');
    }

    // Preparar metadatos de archivos
    const metadatosAdjuntos = req.files?.map(file => ({
      nombreOriginal: file.originalname,
      nombreGuardado: file.filename,
      tipo: file.mimetype,
      tamaño: file.size,
      extension: path.extname(file.originalname).toLowerCase(),
      rutaTemporal: file.path
    })) || [];

    // Conectar a la base de datos
    pool = await sql.connect(connection);
    
    // Crear transacción
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);
      
      // Insertar la queja y obtener el ID generado
      const insertResult = await request
        .input('quejaTitulo', sql.VarChar, titulo)
        .input('areaId', sql.Int, area_id)
        .input('contenido', sql.VarChar, contenido)
        .input('adjuntos', sql.NVarChar, JSON.stringify(metadatosAdjuntos))
        .query(`
          INSERT INTO [Buzon].[dbo].[queja] 
            (quejaTitulo, areaId, contenido, adjuntos) 
          OUTPUT INSERTED.quejaId
          VALUES 
            (@quejaTitulo, @areaId, @contenido, @adjuntos)
        `);

      const quejaId = insertResult.recordset[0].quejaId;

      // Mover archivos a carpeta definitiva
      if (req.files && req.files.length > 0) {
        const rutaDestino = path.join(__dirname, '..', 'adjuntos', String(quejaId));
        fs.mkdirSync(rutaDestino, { recursive: true });

        for (const file of req.files) {
          const destino = path.join(rutaDestino, file.filename);
          fs.renameSync(file.path, destino);

          const fileIndex = metadatosAdjuntos.findIndex(f => f.nombreGuardado === file.filename);
          if (fileIndex !== -1) {
            metadatosAdjuntos[fileIndex].rutaDefinitiva = destino;
            metadatosAdjuntos[fileIndex].rutaTemporal = undefined;
          }
        }

        // Actualizar adjuntos con rutas definitivas
        await new sql.Request(transaction)
          .input('quejaId', sql.Int, quejaId)
          .input('adjuntosActualizados', sql.NVarChar, JSON.stringify(metadatosAdjuntos))
          .query('UPDATE [Buzon].[dbo].[queja] SET adjuntos = @adjuntosActualizados WHERE quejaId = @quejaId');
      }

      await transaction.commit();
      res.redirect('/quejas?success=true&message=Queja registrada exitosamente');

    } catch (error) {
      await transaction.rollback();
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      throw error;
    }

  } catch (error) {
    console.error('Error al guardar la queja:', error);
    res.status(500).redirect('/quejas?success=false&message=Error al procesar la queja');
  } 
};
