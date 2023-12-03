import { Router } from 'express'
import { UserCtrl } from '../controllers'
export const UserRoutes = Router()
  .get('/', UserCtrl.getAllUsers)
  .post('/', UserCtrl.createUser)
