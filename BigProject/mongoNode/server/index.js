require('dotenv').config();
const express = require('express');
const cors = require("cors")
const  start  = require('./database');
const router = require('./routes/index');
const error = require('./middleware/ErrorHandling')
const uploadFile = require('express-fileupload')
const path = require('path')


const PORT = 5000 || process.env.PORT;

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'staticFoto')))
app.use(uploadFile({}))
app.use("/api", router)

// Наш middleware который роботает с ошибками должен идти в конце 
app.use(error)
start();



app.listen(PORT, () => console.log(`worcking on ${PORT}`))