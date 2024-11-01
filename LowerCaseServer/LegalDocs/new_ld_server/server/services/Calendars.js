const DBManager = require("../lib/DBManager");

const Calendars = {
  getCalendars: async (hostId) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Calendars");
  },

  getCalendarTypes: async (hostId) => {
    const db = DBManager(hostId);
    return await db.select("*").from("Calendar_Types");
  },
  
  insertCalendar: async (hostId, Calendar) => {
      const db = DBManager(hostId);
      return await db("Calendars").insert(Calendar).then(async (r) => {
        return await db.select("*").from("Calendars").where("Calendar_name", Calendar.Calendar_name).then((res) => res.length ? res[0] : null );
      });
  },
  updateCalendar: async (hostId, Calendar_name, Calendar) => {
      const db = DBManager(hostId);
      return await db("Calendars").update(Calendar).where({Calendar_name: Calendar_name}).then(async (r) => {
        return await db.select("*").from("Calendars").where("Calendar_name", Calendar.Calendar_name).then((res) => res.length ? res[0] : null );
      });
  },
  deleteCalendar: async (hostId, Calendar_name) => {
      const db = DBManager(hostId);
      return await db("Calendars").delete().where({Calendar_name}).then((r) => ({result: Boolean(r), data: Calendar_name}));
  },

};

module.exports = Calendars;
