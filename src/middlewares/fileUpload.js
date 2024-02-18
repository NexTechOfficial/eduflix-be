const multer = require('multer')
const path = require('path');
const {exists,mkdir} = require('fs')

const maxSize = 50 * 1024 * 1024,
  multerStorage = multer.diskStorage({
    /**
     * 
     * @param {import('../../global').req} req 
     * @param {*} file 
     * @param {*} callback 
     */
    destination: (req, file, callback) => {
      var imageDir = `${req.baseUrl.split('/')[1]}_${file.fieldname}`;
      const dir = path.join(__dirname, `../../public/uploads/${imageDir}`);
      exists(dir, exist => {
        if (!exist) {
          return mkdir(dir, { recursive: true }, error => callback(error, dir));
        }
        callback(null, dir);
      });
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      cb(null, `${file.fieldname}_${Date.now()}.${ext}`);
    },
  });

  const FileUpload = multer({
      storage: multerStorage,
      limits: { fileSize: maxSize },
      fileFilter(req , file, cb) {
        if (
          !file.originalname.match(/\.(png|jpg|jpeg|svg|pdf|PNG|JPG|JPEG|PDF)$/)
        ) {
          return cb('Invalid File Format');
        }
        cb(undefined, true);
      },
    });
exports.multer = FileUpload;
/**
 * 
 * @param {string} field_name 
 */
exports.Single = function (field_name){
    return function (req, res, next) {
      FileUpload.single(field_name)(req, res, function (err) {
        if (err) {
          return res.status(httpStatus.not_acceptable).json({
            status: httpStatus.not_acceptable,
            error: true,
            message: 'Invalid File Provided',
            data: err,
          })
        }
        next()
      })
    }
  }
/**
 * 
 * @param {{name:string;maxCount?:number}[]} fields 
 */
exports.Multiple = function (fields){
    return function (req, res, next) {
      FileUpload.fields(fields)(req, res, function (err) {
        if (err) {
          return res.status(httpStatus.not_acceptable).json({
            status: httpStatus.not_acceptable,
            error: true,
            message: 'Invalid File Provided',
            data: err,
          })
        }
        next()
      })
    }
  }
