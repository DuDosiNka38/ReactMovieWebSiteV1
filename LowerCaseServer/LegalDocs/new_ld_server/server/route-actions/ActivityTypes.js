const DataChecker = require("../services/DataChecker");
const ActivityTypesService = require("./../services/ActivityTypes");

const ActivityTypes = {
  getActivityTypes: async (req, res) => {        
    const activityTypes = await ActivityTypesService.getActivityTypes(req.hostId);
    res.send(activityTypes);
  },
  insertActivityType: async (req, res) => {
    const result = await ActivityTypesService.insertActivityType(req.hostId, req.body);
    res.send(result);
  },
  updateActivityType: async (req, res) => {
    const result = await ActivityTypesService.updateActivityType(req.hostId, req.body.Activity_type, req.body);
    res.send(result);
  },

  deleteActivityType: async (req, res) => {
    const result = await ActivityTypesService.deleteActivityType(req.hostId, req.params);
    res.send(result);
  },
};

module.exports = ActivityTypes;