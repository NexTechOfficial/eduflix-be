//@ts-check
const { Router } = require('express');
const { UserController } = require('../controllers');
const { FileUpload } = require('../middlewares');
// exports.UserRoutes = Router().post('/', UserController.createUser);
exports.UserRoutes = Router().post(
  '/',
  FileUpload.Single('avatar'),
  UserController.createUser
);
