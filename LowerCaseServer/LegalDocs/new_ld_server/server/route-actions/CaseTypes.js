const DataChecker = require("../services/DataChecker");
const CaseTypesService = require("./../services/CaseTypes");

const CaseTypes = {
    getCaseTypes: async (req, res) => {        
      const caseTypes = await CaseTypesService.getCaseTypes(req.hostId);
      res.send(caseTypes);
    },
};

module.exports = CaseTypes;