const DBManager = require("../lib/DBManager");

const ActivityRequirements = {
  getActivityRequirements: async (hostId) => {
      const db = DBManager(hostId);
      return await db.select("*").from("Act_Requirements");
  },
  insertActivityRequirement: async (hostId, data) => {
    try {
      const db = DBManager(hostId);
      return await db("Act_Requirements")
        .insert(data)
        .then((r) => {
          return { result: true, data: data };
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
  updateActivityRequirement: async (hostId, where, data) => {
    const db = DBManager(hostId);
    return await db("Act_Requirements").update(data).where(where).then((r) => ({result: true, data: data}));
  },
  deleteActivityRequirement: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Act_Requirements").delete().where(data).then((r) => ({result: true, data: data}));
  },
};

module.exports = ActivityRequirements;