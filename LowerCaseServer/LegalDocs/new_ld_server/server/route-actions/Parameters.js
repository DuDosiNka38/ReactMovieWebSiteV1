const DataChecker = require("../services/DataChecker");
const ParamsService = require("./../services/Parameters");

const Parameters = {
  getAllUserParameters: async (req, res) => {
    const result = await ParamsService.getAllUserParameters(req.hostId, req.params);
      res.send(result);
  },

  getUserParameter: async (req, res) => {
    const result = await ParamsService.getUserParameter(req.hostId, req.params);
      res.send(result);
  },

  insertUserParameter: async (req, res) => {
    const result = await ParamsService.inserUserParameter(req.hostId, req.body);
    res.send(result);
  },

  updateUserParameter: async (req, res) => {
    const result = await ParamsService.updateUserParameter(req.hostId, req.body);
    res.send(result);
  },

   
  
    // deleteDepartment: async (req, res) => {
    //   const result = await DepartmentsService.deleteDepartment(req.hostId, req.params.Department_id);
    //   res.send(result);
    // },
};

module.exports = Parameters;