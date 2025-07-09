import multer from 'multer';
import path from 'path';

// Configurar almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Guardar en la carpeta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Evitar nombres repetidos
    }
});

const upload = multer({ storage });

export default upload;
