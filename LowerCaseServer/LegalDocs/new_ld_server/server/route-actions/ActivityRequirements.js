const DataChecker = require("../services/DataChecker");
const ActivityRequirementsService = require("../services/ActivityRequirements");

const ActivityRequirements = {
    getActivityRequirements: async (req, res) => {        
      const ActivityRequirements = await ActivityRequirementsService.getActivityRequirements(req.hostId);
      res.send(ActivityRequirements);
    },
    insertActivityRequirement: async (req, res) => {
      const result = await ActivityRequirementsService.insertActivityRequirement(req.hostId, req.body);
      res.send(result);
    },
    updateActivityRequirement: async (req, res) => {
      const result = await ActivityRequirementsService.updateActivityRequirement(req.hostId, {
        Parent_Activity_type: req.body.Parent_Activity_type,
        Child_Activity_type: req.body.Child_Activity_type,
        Case_Type: req.body.Case_Type,
      }, req.body);
      res.send(result);
    },
  
    deleteActivityRequirement: async (req, res) => {
      const result = await ActivityRequirementsService.deleteActivityRequirement(req.hostId, req.params);
      res.send(result);
    },
};

module.exports = ActivityRequirements;