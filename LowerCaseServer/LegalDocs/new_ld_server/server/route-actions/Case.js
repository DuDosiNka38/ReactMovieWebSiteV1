const DataChecker = require("../services/DataChecker");
const UserService = require("./../services/User");
const CaseService = require("./../services/Case");

const Case = {
  getCases: async (req, res) => {
    const { type } = req.params;

    switch (type) {
      case "user":
        const userData = await UserService.getUserByAuthHash(req.hostId, req.headers.user_auth_hash);
        if (!userData.result) {
          res.send(userData);
          return false;
        }

        const userCases = await CaseService.getUserCases(req.hostId, userData.data.Person_id);
        res.send(userCases);
        return null;

      case "all":
        const allCases = await CaseService.getAllCases(req.hostId);
        res.send(allCases);
        return null;

      default:
        res.send({ result: false });
    }
  },

  getCasesByPersonId: async (req, res) => {
    const { Person_id } = req.params;
    const userCases = await CaseService.getUserCases(req.hostId, Person_id);
    res.send(userCases);
  },

  getSingleCase: async (req, res) => {
    const { Case_Short_NAME } = req.params;
    const caseData = await CaseService.getSingleCase(req.hostId, Case_Short_NAME);
    res.send(caseData);
  },

  getCaseLog: async (req, res) => {
    const result = await CaseService.getCaseLog(req.hostId, req.params);
    res.send(result);
  },

  insertCase: async (req, res) => {
    const result = await CaseService.insertCase(req.hostId, req.body);
    res.send(result);
  },

  updateCase: async (req, res) => {
    const result = await CaseService.updateCase(req.hostId, req.body, req.params.Case_Short_NAME);
    res.send(result);
  },

  deleteCase: async (req, res) => {
    const result = await CaseService.deleteCase(req.hostId, req.params.Case_Short_NAME);
    res.send(result);
  },
};

module.exports = Case;
