const DBManager = require("../lib/DBManager");

const CaseRoles = {
    getCaseRoles: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Case_Roles");
    },
};

module.exports = CaseRoles;