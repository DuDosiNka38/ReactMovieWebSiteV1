const DataChecker = require("../services/DataChecker");
const UserRolesService = require("../services/UserRoles");

const UserRoles = {
    getUserRoles: async (req, res) => {        
      const UserRoles = await UserRolesService.getUserRoles(req.hostId);
      res.send(UserRoles);
    },
};

module.exports = UserRoles;