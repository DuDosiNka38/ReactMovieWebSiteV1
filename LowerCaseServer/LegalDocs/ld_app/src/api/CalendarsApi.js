import axios from "./../services/axios";

const CalendarsApi = {
  fetchCalendars: async () => {
    return await axios.get("/api/calendars").then((r) => r.data);
  },

  fetchCalendarTypes: async () => {
    return await axios.get("/api/calendar-types").then((r) => r.data);
  },

  postCalendar: async (data) => {
    return await axios
    .post("/api/calendar", data)
    .then((r) => r.data)
    .catch((e) => e);
  },

  putCalendar: async (Calendar_name, data) => {
    return await axios
    .put(`/api/calendar/${Calendar_name}`, data)
    .then((r) => r.data)
    .catch((e) => e);
  },

  deleteCalendar: async (Calendar_name) => {
    return await axios
    .delete(`/api/calendar/${Calendar_name}`)
    .then((r) => r.data)
    .catch((e) => e);
  },
};

export default CalendarsApi;
