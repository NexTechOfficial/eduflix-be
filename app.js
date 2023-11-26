import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import DB from './database/sqlDB.connect.js'
import swaggerUi from 'swagger-ui-express'
import Routes from './src/routes/index.js'
const { SERVER_IP, PORT } = process.env

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EduFlix', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'REST APIs for EduFlix', // short description of the app
  },
  host: `${SERVER_IP}:${PORT}/`, // the host or url of the app
  basePath: `${SERVER_IP}:${PORT}/`, // the basepath of your endpoint
  apisSorter: 'method', // sort apis according to sequence of methods.
  //apisSorter : "alpha" sort apis according to alphabetical order.

  components: {
    securitySchemas: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: `http://${SERVER_IP}:${Number(PORT)}/`,
    },
  ],
}
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['apis/*.yaml'],
  docExpansion: 'none',
})
const Server = express();
Server
  .set('trust proxy', true)
  .use(express.urlencoded({ extended: true })) //for x-www-form-urlencoded
  .use(express.json()) //to get data in JSON format
  .use(
    cors({
      origin: '*',
      methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    })
  )
  .use('/assets', express.static('./public/assets'))
  .use('/user', Routes.UserRoutes)
  .use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  .use(function (err, req, res, next) {
    next(
      res.status(404).send({
        status: 404,
        error: true,
        message: 'No Such URL',
        data: null,
      })
    )
  })
  .listen(parseInt(PORT), '0.0.0.0', async () => {
    try {
        await DB.authenticate()
        console.log(`Server is Listening on PORT:${PORT}`)
    } catch (error) {
        console.log(`Error Connecting DB->`,error);
        process.exit(1);
    }
  })