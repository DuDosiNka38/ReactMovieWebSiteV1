const express = require("express");
const Info = require("./../services/info");

const infoRouter = express.Router();
const jsonParser = express.json();

infoRouter.get("/test", jsonParser, Info.test);

module.exports = infoRouter;
