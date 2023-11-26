import multer from 'multer';
import path from 'path';
import { exists, mkdir } from 'fs';

const maxSize = 50 * 1024 * 1024,
  multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      var imageDir = `${req.baseUrl.split('/')[2]}_${file.fieldname}`;
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
  fileFilter(req, file, cb) {
    if (
      !file.originalname.match(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/)
    ) {
      return cb('Invalid File Format');
    }
    cb(undefined, true);
  },
});
// async function (req, res, next) {
//     await UploadMiddleware.single('thumbnail')(req, res, err => {
//       if (err) {
//         return res
//           .status(500)
//           .json({
//             status: 406,
//             error: true,
//             message: 'Invalid File',
//             data: null,
//           });
//       }
//       next();
//     });
//   }

export default FileUpload;
