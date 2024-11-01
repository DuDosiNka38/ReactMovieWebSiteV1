const express = require("express");
const router = express.Router();
const RoomsController = require("../controllers/roomsController");





    router.post('/', RoomsController.create);
    router.get('/', RoomsController.getAll);
    router.get('/:id', RoomsController.getOne);
    router.post('/:id', RoomsController.postMessange);
  
 
  
    module.exports =  router;
 
 