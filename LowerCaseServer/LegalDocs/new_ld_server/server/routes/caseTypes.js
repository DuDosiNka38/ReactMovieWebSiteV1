const express = require("express");
const { getCaseTypes } = require("../route-actions/CaseTypes");

const caseTypesRouter = express.Router();
const jsonParser = express.json();

caseTypesRouter.get("/case-types", getCaseTypes);

module.exports = caseTypesRouter;
