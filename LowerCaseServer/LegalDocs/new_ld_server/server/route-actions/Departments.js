const DataChecker = require("../services/DataChecker");
const DepartmentsService = require("./../services/Departments");

const Departments = {
    getDepartments: async (req, res) => {        
      const departments = await DepartmentsService.getDepartments(req.hostId);
      res.send(departments);
    },

    insertDepartment: async (req, res) => {
      const result = await DepartmentsService.insertDepartment(req.hostId, req.body);
      res.send(result);
    },
  
    updateDepartment: async (req, res) => {
      const result = await DepartmentsService.updateDepartment(req.hostId, req.params.Department_id, req.body);
      res.send(result);
    },
  
    deleteDepartment: async (req, res) => {
      const result = await DepartmentsService.deleteDepartment(req.hostId, req.params.Department_id);
      res.send(result);
    },
};

module.exports = Departments;