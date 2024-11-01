const DataChecker = require("../services/DataChecker");
const CaseParticipantsService = require("../services/CaseParticipants");

const CaseParticipants = {
  getAllCaseParticipants: async (req, res) => {        
    const CaseParticipants = await CaseParticipantsService.getAllCaseParticipants(req.hostId, req.params);
    res.send(CaseParticipants);
  },
  getCaseParticipants: async (req, res) => {        
    const CaseParticipants = await CaseParticipantsService.getCaseParticipants(req.hostId, req.params);
    res.send(CaseParticipants);
  },

  insertCaseParticipant: async (req, res) => {
    const result = await CaseParticipantsService.insertCaseParticipant(req.hostId, req.body);
    res.send(result);
  },

  insertCaseParticipants: async (req, res) => {
    const result = await CaseParticipantsService.insertCaseParticipants(req.hostId, req.body);
    res.send(result);
  },

  deleteCaseParticipant: async (req, res) => {
    const result = await CaseParticipantsService.deleteCaseParticipant(req.hostId, req.params);
    res.send(result);
  },


};

module.exports = CaseParticipants;