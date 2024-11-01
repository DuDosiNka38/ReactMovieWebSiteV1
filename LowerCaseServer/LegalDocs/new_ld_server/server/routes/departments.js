const express = require("express");
const { getDepartments, insertDepartment, updateDepartment, deleteDepartment } = require("../route-actions/Departments");

const departmentsRouter = express.Router();
const jsonParser = express.json();

departmentsRouter.get("/departments", getDepartments);
departmentsRouter.post("/department", jsonParser, insertDepartment);
departmentsRouter.put("/department/:Department_id", jsonParser, updateDepartment);
departmentsRouter.delete("/department/:Department_id", deleteDepartment);

module.exports = departmentsRouter;
