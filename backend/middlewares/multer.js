
/**
 * Multer Module
 * 
 * @description Multer is a middleware that is used for handling multipart/form-data, which is primarily used for uploading files.
 * @author Joseph Ryan P. Peña
 * @date 04/30/2024
 * 
 */


const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req,file,cb){
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 10 * 1024 * 1024     // Maximum field size of 10 MB
    }
});


module.exports = upload;