const DBManager = require("./../lib/DBManager");

const CaseParticipants = {
  getAllCaseParticipants: async (hostId) => {
    const db = DBManager(hostId);
    
    return await db.raw("CALL GET_ALL_CASE_PARTICIPANTS()").then((r) => {
      return r[0][0];
    });
  },
  getCaseParticipants: async (hostId, props) => {
    const db = DBManager(hostId);
    
    return await db.raw("CALL GET_CASE_PARTICIPANTS(?)", props.Case_NAME).then((r) => {
      return r[0][0];
    });
  },

  insertCaseParticipant: async (hostId, caseParticipant) => {
    try {
      const db = DBManager(hostId);
      return await db("Case_Participants")
        .insert(caseParticipant)
        .then((r) => {
          return { result: true, data: caseParticipant };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },

  insertCaseParticipants: async (hostId, caseParticipants) => {
    try {
      const db = DBManager(hostId);
      return await db("Case_Participants")
        .insert(caseParticipants)
        .then((r) => {
          return { result: true, data: caseParticipants };
        });
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  },

  deleteCaseParticipant: async (hostId, caseParticipant) => {
    try {
      const db = DBManager(hostId);
      return await db("Case_Participants").delete().where(caseParticipant).then((r) => ({result: true, data: caseParticipant}));
    } catch (e) {
      return {
        result: false,
        data: {
          error_code: e.code,
          error_message: e.message || e.sqlMessage,
        },
      };
    }
  }
};

module.exports = CaseParticipants;
