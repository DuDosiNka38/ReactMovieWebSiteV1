const DataChecker = require("../services/DataChecker");
const FileFormatsService = require("../services/FileFormats");

const FileFormats = {
    getFileFormats: async (req, res) => {        
      const FileFormats = await FileFormatsService.getFileFormats(req.hostId);
      res.send(FileFormats);
    },
};

module.exports = FileFormats;