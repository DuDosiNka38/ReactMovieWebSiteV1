const DBManager = require("../lib/DBManager");

const FileFormats = {
    getFileFormats: async (hostId) => {
        const db = DBManager(hostId);
        return await db.select("*").from("File_Formats").where("disabled", 0);
    },
};

module.exports = FileFormats;