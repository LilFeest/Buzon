const connection = require('../config/dbconfig');
const sql = require('mssql')


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
  
      await request.query('INSERT INTO [Buzon].[dbo].[queja] (quejaTitulo, areaId, contenido) VALUES (@quejaTitulo, @areaId, @contenido)');
      
      res.redirect('/quejas'); // Redirecciona después de guardar
      return { success: true, message: 'Área registrada exitosamente' };
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      res.status(500).send('Error en la base de datos');
    }
  };

    // Agregar nueva queja a la base de datos
/*exports.agregarQueja = async (quejaData) => {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('quejaTitulo', sql.VarChar(80), quejaData.titulo)
                .input('areaId', sql.Int, quejaData.area_id)
                .input('contenido', sql.VarChar(500), quejaData.contenido)
                .query(`
                    INSERT INTO [Buzon].[dbo].[queja] (quejaTitulo, areaId, contenido)
                    VALUES (@quejaTitulo, @areaId, @contenido)
                `);
                res.send('se envio bien')
                console.log(result)
        } catch (error) {
            console.error('Error al registrar queja:', error);
            throw new Error('Error al guardar la queja en la base de datos');
        }
    }*/

    // Obtener todas las áreas para el dropdown
/*exports.obtenerAreas = async () => {
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
