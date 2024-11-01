const DataChecker = require("../services/DataChecker");
const CaseSidesService = require("../services/CaseSides");

const CaseSides = {
    getCaseSides: async (req, res) => {        
      const CaseSides = await CaseSidesService.getCaseSides(req.hostId);
      res.send(CaseSides);
    },
};

module.exports = CaseSides;