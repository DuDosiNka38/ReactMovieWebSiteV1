const DBManager = require("../lib/DBManager");

const FileStatuses = {
    getFileStatuses: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("File_statuses");
    },
};

module.exports = FileStatuses;