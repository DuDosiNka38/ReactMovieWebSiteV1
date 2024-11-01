const DataChecker = require("../services/DataChecker");
const FileStatusesService = require("../services/FileStatuses");

const FileStatuses = {
    getFileStatuses: async (req, res) => {        
      const FileStatuses = await FileStatusesService.getFileStatuses(req.hostId);
      res.send(FileStatuses);
    },
};

module.exports = FileStatuses;