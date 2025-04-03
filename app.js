const express = require('express');
const app = express();
const port = 4500;
const routes = require('./routes/route');
const connection = require('./config/dbconfig')


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', './views');

// Rutas
app.use('/', routes);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});