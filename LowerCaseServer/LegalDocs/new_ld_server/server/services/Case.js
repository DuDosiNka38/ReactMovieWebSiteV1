const DBManager = require("./../lib/DBManager");

const Case = {
  getUserCases: async (hostId, Person_id) => {
    const db = DBManager(hostId);
    return await db
      .select(["Cases.*", "Docs_Count.Case_Docs_Count", "Events_Count.Case_Events_Count"])
      .from("Cases")
      .joinRaw(
        "LEFT JOIN (SELECT IFNULL(COUNT(*), 0) as `Case_Docs_Count`, `Case_NAME` FROM `Documents` GROUP BY `Case_NAME`) as `Docs_Count`  ON `Docs_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME`"
      )
      .joinRaw(
        "LEFT JOIN (SELECT IFNULL(COUNT(*), 100) as `Case_Events_Count`, `Case_NAME` FROM `Activities` GROUP BY `Case_NAME`) as `Events_Count`  ON `Events_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME`"
      )
      .join("Case_Participants", "Case_Participants.Case_NAME", "Cases.Case_Short_NAME")
      .where("Case_Participants.Person_id", "=", Person_id);
  },

  getAllCases: async (hostId) => {
    const db = DBManager(hostId);
    return await db
      .select(["Cases.*", "Docs_Count.Case_Docs_Count", "Events_Count.Case_Events_Count"])
      .from("Cases")
      .joinRaw(
        "LEFT JOIN (SELECT IFNULL(COUNT(*), 0) as `Case_Docs_Count`, `Case_NAME` FROM `Documents` GROUP BY `Case_NAME`) as `Docs_Count`  ON `Docs_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME`"
      )
      .joinRaw(
        "LEFT JOIN (SELECT IFNULL(COUNT(*), 100) as `Case_Events_Count`, `Case_NAME` FROM `Activities` GROUP BY `Case_NAME`) as `Events_Count`  ON `Events_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME`"
      );
  },

  getSingleCase: async (hostId, Case_Short_NAME) => {
    const db = DBManager(hostId);
    return await db
      .select(["Cases.*", "Docs_Count.Case_Docs_Count", "Events_Count.Case_Events_Count"])
      .from("Cases")
      .joinRaw(
        "LEFT JOIN (SELECT IFNULL(COUNT(*), 0) as `Case_Docs_Count`, `Case_NAME` FROM `Documents` GROUP BY `Case_NAME`) as `Docs_Count`  ON `Docs_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME`"
      )
      .joinRaw(
        "LEFT JOIN (SELECT IFNULL(COUNT(*), 100) as `Case_Events_Count`, `Case_NAME` FROM `Activities` GROUP BY `Case_NAME`) as `Events_Count`  ON `Events_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME`"
      )
      .where({ Case_Short_NAME }).then((r) => (r.length > 0 ? r[0] : null));
  },

  getCaseLog: async (hostId, {Case_NAME}) => {
    const db = DBManager(hostId);

    console.log(db
      .select(["Case_Actions_Log.*", "Case_Actions.Action_DESC"])
      .from("Case_Actions_Log")
      .leftJoin("Case_Actions")
      .where("Case_Actions_Log.Case_NAME", Case_NAME).toString())
    return await db
      .select(["Case_Actions_Log.*", "Case_Actions.Action_DESC"])
      .from("Case_Actions_Log")
      .leftJoin("Case_Actions")
      .where("Case_Actions_Log.Case_NAME", Case_NAME);
  },

  insertCase: async (hostId, caseData) => {
    try {
      const db = DBManager(hostId);
      return await db("Cases")
        .insert(caseData)
        .then((r) => {
          return { result: true, data: caseData };
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
  updateCase: async (hostId, caseData, Case_Short_NAME) => {
    const db = DBManager(hostId);
    return await db("Cases").update(caseData).where({ Case_Short_NAME: Case_Short_NAME }).then((r) => ({result: true, data: Case_Short_NAME}));
  },
  deleteCase: async (hostId, Case_Short_NAME) => {
    const db = DBManager(hostId);
    return await db("Cases").delete().where({ Case_Short_NAME: Case_Short_NAME }).then((r) => ({result: true, data: Case_Short_NAME}));
  },
};

//SELECT `Cases`.*, (SELECT COUNT(*) FROM `Documents` WHERE `Documents`.`Case_NAME` = `Cases`.`Case_Short_NAME`) as `Case_Documents_Count` FROM `Cases` JOIN `Case_Participants` ON `Case_Participants`.`Case_NAME` = `Cases`.`Case_Short_NAME` WHERE `Case_Participants`.`Person_id` = 'ROOT'
//SELECT `Cases`.*, `Docs_Count`.`Case_Docs_Count` FROM `Cases` JOIN (SELECT COUNT(*) as `Case_Docs_Count`, `Case_NAME` FROM `Documents` GROUP BY `Case_NAME`) AS `Docs_Count` ON `Docs_Count`.`Case_NAME` = `Cases`.`Case_Short_NAME` JOIN `Case_Participants` ON `Case_Participants`.`Case_NAME` = `Cases`.`Case_Short_NAME`  WHERE `Case_Participants`.`Person_id` = 'ROOT'
module.exports = Case;
