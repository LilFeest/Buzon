const express = require('express')
const router = express.Router();

//ruta mainpage
router.get('/',(req,res)=>{
    res.render('index')
})

//ruta Aviso
router.get('/aviso', (req, res) => {
    res.render('aviso'); 
});

// Ruta del formulario de quejas (GET)
// En tu archivo routes/route.js
router.get('/quejas', (req, res) => {
    res.render('queja', {  // Cambiado de 'queja-anonima' a 'queja'
        areas: [
            { id: 1, nombre: 'Recursos Humanos' },
            { id: 2, nombre: 'TI' }
        ]
    });
});
// Ruta para procesar el formulario (POST) - Mock para frontend
router.post('/quejas', (req, res) => {
    // Simular éxito (sin base de datos)
    console.log('Queja recibida (simulación):', req.body);
    res.send(`
        <script>
            alert('¡Queja enviada exitosamente!');
            window.location.href = '/quejas';
        </script>
    `);
});


module.exports = router;