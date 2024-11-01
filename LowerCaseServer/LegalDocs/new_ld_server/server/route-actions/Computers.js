const DataChecker = require("../services/DataChecker");
const ComputersService = require("../services/Computers");

const Computers = {
  getComputers: async (req, res) => {        
    const Computers = await ComputersService.getComputers(req.hostId);
    res.send(Computers);
  },
  getUserComputers: async (req, res) => {        
    const Computers = await ComputersService.getUserComputers(req.hostId, req.params);
    res.send(Computers);
  },
  insertComputer: async (req, res) => {        
    const Computers = await ComputersService.insertComputer(req.hostId, req.body);
    res.send(Computers);
  },
  updateComputer: async (req, res) => {        
    const result = await ComputersService.updateComputer(req.hostId, req.body, req.params);
    res.send(result);
  },
  deleteComputer: async (req, res) => {        
    const result = await ComputersService.deleteComputer(req.hostId, req.params);
    res.send(result);
  },
};

module.exports = Computers;