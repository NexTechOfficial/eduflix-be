import { Router } from 'express'
import { UserCtrl } from '../controllers'
export const UserRoutes = Router()
  .get('/', async function (req, res) {
    res.send(req.url)
  })
  .post('/', UserCtrl.createUser)
