const DBManager = require("../lib/DBManager");

const UserRoles = {
    getUserRoles: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Roles");
    },
};

module.exports = UserRoles;