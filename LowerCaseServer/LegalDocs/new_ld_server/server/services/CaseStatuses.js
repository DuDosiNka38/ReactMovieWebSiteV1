const DBManager = require("../lib/DBManager");

const CaseStatuses = {
    getCaseStatuses: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Case_Statuses");
    },
};

module.exports = CaseStatuses;