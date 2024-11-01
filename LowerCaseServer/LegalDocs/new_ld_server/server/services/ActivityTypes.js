const DBManager = require("../lib/DBManager");

const ActivityTypes = {
  getActivityTypes: async (hostId) => {
      const db = DBManager(hostId);
      return await db.select("*").from("Activity_types");
  },
  getActivityType: async (hostId, where) => {
      const db = DBManager(hostId);
      return await db.select("*").from("Activity_types").where(where);
  },
  insertActivityType: async (hostId, data) => {
    try {
      const db = DBManager(hostId);
      return await db("Activity_types")
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
  updateActivityType: async (hostId, Activity_type, data) => {
    const db = DBManager(hostId);
    return await db("Activity_types").update(data).where({Activity_type}).then((r) => ({result: true, data: data}));
  },
  deleteActivityType: async (hostId, data) => {
    const db = DBManager(hostId);
    return await db("Activity_types").delete().where(data).then((r) => ({result: true, data: data}));
  },
};

module.exports = ActivityTypes;