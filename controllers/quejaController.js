const connection = require('../config/dbconfig');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

exports.guardarqueja = async (req, res) => {
  try {
    // Seteando uno por uno los valores del req.body
    const prueba_campo1 = req.body.titulo;
    const prueba_campo2 = req.body.area_id;
    const prueba_campo3 = req.body.contenido;

    if (!prueba_campo1 || !prueba_campo2) {
      return res.status(400).send('Faltan datos obligatorios');
    }

    pool = await sql.connect(connection);
    // Consulta SQL con parámetros
    const request = pool.request();
    request.input('quejaTitulo', sql.VarChar, prueba_campo1);
    request.input('areaId', sql.VarChar, prueba_campo2);
    request.input('contenido', sql.VarChar, prueba_campo3);

    // Insertar la queja en la base de datos
    await request.query('INSERT INTO [Buzon].[dbo].[queja] (quejaTitulo, areaId, contenido) VALUES (@quejaTitulo, @areaId, @contenido)');

    // Obtener el ID de la queja recién insertada
    const result = await request.query('SELECT SCOPE_IDENTITY() AS quejaId');
    const quejaId = result.recordset[0].quejaId;

    // Crear subcarpeta para esta queja
    const rutaDestino = path.join(__dirname, '..', 'adjuntos', String(quejaId));
    if (!fs.existsSync(rutaDestino)) {
      fs.mkdirSync(rutaDestino, { recursive: true });
    }

    // Array para guardar las rutas de los archivos
    const archivosGuardados = [];

    // Mover los archivos desde adjuntos_temp a la carpeta nueva
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const origen = file.path;
        const destino = path.join(rutaDestino, file.originalname);
        fs.renameSync(origen, destino);
        
        // Almacenar las rutas de los archivos
        archivosGuardados.push(destino);
      });

      // Aquí puedes hacer un UPDATE para agregar las rutas de los archivos en la base de datos
      const adjuntos = archivosGuardados.join(','); // Concatena las rutas de los archivos

      // Actualizar la base de datos con las rutas de los archivos
      const updateRequest = pool.request();
      updateRequest.input('quejaId', sql.Int, quejaId);
      updateRequest.input('adjuntos[]', sql.VarChar, adjuntos);

      // Realizar el UPDATE en el campo adjuntos
      await updateRequest.query('UPDATE [Buzon].[dbo].[queja] SET adjuntos = 889  WHERE id = @quejaId');
    }

    res.redirect('/quejas?success=true&message=Queja registrada exitosamente');
    
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.status(500).send('Error en la base de datos');
  }
};

