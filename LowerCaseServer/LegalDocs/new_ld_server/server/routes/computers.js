const express = require("express");
const { getComputers, getUserComputers, insertComputer, updateComputer, deleteComputer } = require("../route-actions/Computers");

const computersRouter = express.Router();
const jsonParser = express.json();

computersRouter.get("/computers", getComputers);
computersRouter.get("/computers/:Person_id", getUserComputers);
computersRouter.post("/computer", jsonParser, insertComputer);
computersRouter.put("/computer/:Person_id/:Mac_Address", jsonParser, updateComputer);
computersRouter.delete("/computer/:Person_id/:Mac_Address", deleteComputer);

module.exports = computersRouter;
