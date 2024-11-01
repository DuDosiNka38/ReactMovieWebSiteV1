const DBManager = require("../lib/DBManager");

const RelationTypes = {
    getRelationTypes: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("Relation_Types");
    },
};

module.exports = RelationTypes;