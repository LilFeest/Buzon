// middlewares/multerConfig.js
const multer = require('multer');
const path = require('path');

// Carpeta temporal para archivos
const tempPath = path.join(__dirname, '..', 'adjuntos_temp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { files: 3 }
});

module.exports = upload;



