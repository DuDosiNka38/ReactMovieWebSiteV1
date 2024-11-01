const DataChecker = require("../services/DataChecker");
const RelationTypesService = require("../services/RelationTypes");

const RelationTypes = {
    getRelationTypes: async (req, res) => {        
      const RelationTypes = await RelationTypesService.getRelationTypes(req.hostId);
      res.send(RelationTypes);
    },
};

module.exports = RelationTypes;