const DBManager = require("../lib/DBManager");

const CaseSides = {
    getCaseSides: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Case_Sides");
    },
};

module.exports = CaseSides;