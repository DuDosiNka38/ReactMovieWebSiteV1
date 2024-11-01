const DataChecker = require("../services/DataChecker");
const CaseRolesService = require("../services/CaseRoles");

const CaseRoles = {
    getCaseRoles: async (req, res) => {        
      const CaseRoles = await CaseRolesService.getCaseRoles(req.hostId);
      res.send(CaseRoles);
    },
};

module.exports = CaseRoles;