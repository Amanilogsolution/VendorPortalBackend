const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router/router');
// const path = require('path')
const Port = 8080;

const multer = require("multer");

require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/api',router)
app.use(express.static('./public/uploads'));

app.get('/',function(req,res){
  res.send('VendorPortal')
})

app.listen(Port, (err, req, res, next) => {
  if (err)
    console.log("Ouch! Something went wrong")
  console.log(`server listen on: ${Port}`)
})
