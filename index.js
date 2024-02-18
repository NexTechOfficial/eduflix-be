//@ts-check
require('dotenv').config()
const express = require('express');
const Server = express();
const cors = require('cors');
const {PORT} = process.env;
const {connectMongoDB} = require('./db/mongo.db');
const {Routes} = require('./src/routes');

Server.set('trust proxy', true)
.use(express.urlencoded({ extended: true })) //for x-www-form-urlencoded
.use(express.json()) //to get data in JSON format
.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
Server.use('/user',Routes.user);


Server.get('/helll',(req,res)=>{
    res.send("Hello Work");
});
connectMongoDB().then(()=>{
    console.log(`MongoDB Connected!`);
    Server.listen(Number(PORT),'0.0.0.0',()=>{
    console.log(`Server is Listened on PORT:${PORT}`);
    })
}).catch((err)=>console.log("Error Connecting MongoDB:",err))