const express = require('express');
const router = express.Router();
const connection = require('../config/dbconfig.js')
const areaController = require('../controllers/areaController');
const quejaController = require('../controllers/quejaController');
const reporteController = require('../controllers/reporteController');
const adjuntosController = require('../controllers/adjuntosController');
const upload = require('../middlewares/multerConfig');

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
        await areaController.agregarArea(req, res); 
    } catch (error) {
        res.redirect(`/areas?success=false&message=${encodeURIComponent(error.message)}`);
    }
});

router.post('/quejas', upload.array('adjuntos[]', 3), async (req, res) => {
    try {
        // Aquí llamas al controller para guardar la queja
        await quejaController.guardarqueja(req, res); // Asegúrate de que el nombre del método sea el correcto
    } catch (error) {
        // Si ocurre un error, redirige al cliente con el mensaje de error
        res.redirect(`/quejas?success=false&message=${encodeURIComponent(error.message)}`);
    }
});

router.get('/reporte', reporteController.mostrarReporte);
//router.get('/:id', adjuntosController.obtenerAdjuntos);
// Ruta para descargar un archivo adjunto
router.get('/quejas/adjuntos/:id', adjuntosController.obtenerAdjuntos);
router.get('/quejas/adjuntos/descargar/:quejaId/:nombreGuardado', adjuntosController.descargarAdjunto);

module.exports = router;