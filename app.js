const express = require('express');
const app = express();
const port = 4500;
const routes = require('./routes/route');
const sql = require('mssql');

//use
app.use('/', routes);
app.use(express.static('public'));


//set
app.set('view engine', 'ejs');
app.set('views', './views');


//listen
app.listen(port, () => {
console.log(`Servidor funcional en http://127.0.0.1:${port}`)
})

