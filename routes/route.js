const express = require('express');
const router = express.Router();
const connection = require('../config/dbconfig.js')
const areaController = require('../controllers/areaController');
const quejaController = require('../controllers/quejaController');
const reporteController = require('../controllers/reporteController');


router.post('/agregarqueja',quejaController.guardarqueja)


// Ruta principal
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta Aviso
router.get('/aviso', (req, res) => {
    res.render('aviso');
});

// Ruta de quejas (GET) get de areas en el formulario de quejas
router.get('/quejas', async (req, res) => {
    connection.query('SELECT areaId as id, nombre FROM [Buzon].[dbo].[area] ORDER BY nombre', (error, areasResults) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error en la consulta');
        }
        res.render('queja', {
            areas: areasResults.recordset,
          });    
    })
});


// Ruta para mostrar formulario de áreas (GET)
router.get('/areas', (req, res) => {
    res.render('area', {
        success: req.query.success,
        message: req.query.message
    });
});

//(POST)
router.post('/areas', async (req, res) => {
    try {
        await areaController.agregarArea(req, res); // <- ✔️ PASA req y res completos
    } catch (error) {
        res.redirect(`/areas?success=false&message=${encodeURIComponent(error.message)}`);
    }
});


router.post('/quejas', async (req, res) => {
    try {
        await quejaController.agregarQueja(req.body);
        console.log(req.body)
        res.redirect('/quejas?success=true&message=Queja enviada exitosamente');
        
    } catch (error) {
        res.redirect(`/quejas?success=false&message=${encodeURIComponent(error.message)}`);
    }
});



router.get('/reportes', async (req, res) => {
    connection.query('SELECT q.quejaId, q.quejaTitulo, q.contenido, q.fechaIn, q.estado, a.nombre AS area FROM [Buzon].[dbo].[area] q INNER JOIN area a ON q.areaId = a.areaId ORDER BY q.fechaIn desc;', (error, quejaResults) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Error en la consulta');
        }
        res.render('reporte', {
            quejas: quejaResults.recordset,
          });    
    })
});

module.exports = router;