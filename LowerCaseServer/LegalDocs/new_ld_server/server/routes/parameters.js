const express = require("express");
const { getAllUserParameters, getUserParameter, insertUserParameter, updateUserParameter } = require("../route-actions/Parameters");

const paramsRouter = express.Router();
const jsonParser = express.json();

paramsRouter.get("/parameters/user/:Person_id", getAllUserParameters);
paramsRouter.get("/parameter/:Parameter_name/user/:Person_id", getUserParameter);

paramsRouter.post("/parameter", jsonParser, insertUserParameter);
paramsRouter.put("/parameter", jsonParser, updateUserParameter);

// departmentsRouter.delete("/department/:Department_id", deleteDepartment);

module.exports = paramsRouter;
