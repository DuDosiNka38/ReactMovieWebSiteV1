const DataChecker = require("../services/DataChecker");
const CalendarsService = require("../services/Calendars");

const Calendars = {
    getCalendars: async (req, res) => {        
      const Calendars = await CalendarsService.getCalendars(req.hostId);
      res.send(Calendars);
    },

    getCalendarTypes: async (req, res) => {        
      const Calendars = await CalendarsService.getCalendarTypes(req.hostId);
      res.send(Calendars);
    },

    insertCalendar: async (req, res) => {
      const result = await CalendarsService.insertCalendar(req.hostId, req.body);
      res.send(result);
    },
  
    updateCalendar: async (req, res) => {
      const result = await CalendarsService.updateCalendar(req.hostId, req.params.Calendar_name, req.body);
      res.send(result);
    },
  
    deleteCalendar: async (req, res) => {
      const result = await CalendarsService.deleteCalendar(req.hostId, req.params.Calendar_name);
      res.send(result);
    },
};

module.exports = Calendars;