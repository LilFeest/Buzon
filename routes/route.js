const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const quejaController = require('../controllers/quejaController');

// Ruta principal
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta Aviso
router.get('/aviso', (req, res) => {
    res.render('aviso');
});

// Ruta de quejas (GET)
router.get('/quejas', async (req, res) => {
    try {
        const areas = await quejaController.obtenerAreas();
        res.render('queja', {
            areas: areas,
            success: req.query.success,
            message: req.query.message
        });
    } catch (error) {
        res.render('queja', {
            areas: [],
            success: false,
            message: 'Error al cargar las áreas'
        });
    }
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
        await areaController.agregarArea(req.body);
        res.redirect('/areas?success=true&message=Área registrada exitosamente');
    } catch (error) {
        res.redirect(`/areas?success=false&message=${error.message}`);
    }
});

router.post('/quejas', async (req, res) => {
    try {
        await quejaController.agregarQueja(req.body);
        res.redirect('/quejas?success=true&message=Queja enviada exitosamente');
    } catch (error) {
        res.redirect(`/quejas?success=false&message=${encodeURIComponent(error.message)}`);
    }
});

module.exports = router;