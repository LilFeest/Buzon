const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

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
        const areas = await areaController.obtenerAreas();
        res.render('queja', { areas });
    } catch (error) {
        res.render('queja', {
            areas: [],
            error: 'Error al cargar las áreas'
        });
    }
});

// Ruta de quejas (POST)
router.post('/quejas', (req, res) => {
    console.log('Queja recibida (simulación):', req.body);
    res.send(`
        <script>
            alert('¡Queja enviada exitosamente!');
            window.location.href = '/quejas';
        </script>
    `);
});

// Ruta para mostrar formulario de áreas (GET)
router.get('/areas', (req, res) => {
    res.render('area', {
        success: req.query.success,
        message: req.query.message
    });
});

// Ruta para procesar áreas (POST)
router.post('/areas', async (req, res) => {
    try {
        await areaController.agregarArea(req.body);
        res.redirect('/areas?success=true&message=Área registrada exitosamente');
    } catch (error) {
        res.redirect(`/areas?success=false&message=${error.message}`);
    }
});

module.exports = router;