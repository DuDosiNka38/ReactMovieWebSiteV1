const DataChecker = require("../services/DataChecker");
const CaseStatusesService = require("../services/CaseStatuses");

const CaseStatuses = {
    getCaseStatuses: async (req, res) => {        
      const CaseStatuses = await CaseStatusesService.getCaseStatuses(req.hostId);
      res.send(CaseStatuses);
    },
};

module.exports = CaseStatuses;