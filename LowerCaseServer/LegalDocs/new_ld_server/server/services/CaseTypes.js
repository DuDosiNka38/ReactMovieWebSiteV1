const DBManager = require("./../lib/DBManager");

const CaseTypes = {
    getCaseTypes: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Case_Types");
    },
};

module.exports = CaseTypes;