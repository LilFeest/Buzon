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

module.exports = router;