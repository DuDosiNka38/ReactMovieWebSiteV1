import axios from "../services/axios";

const EventsApi = {
  fetchEvent: async (Activity_Name) => {
    return await axios.get(`/api/event/${Activity_Name}`).then((r) => r.data);
  },

  fetchEvents: async () => {
    return await axios.get("/api/events").then((r) => r.data);
  },

  fetchCaseEvents: async (Case_NAME) => {
    return await axios.get(`/api/events/case/${Case_NAME}`).then((r) => r.data);
  },

  fetchUserEvents: async (Person_id) => {
    return await axios.get(`/api/events/user/${Person_id}`).then((r) => r.data);
  },

  fetchUserUpcomingEvents: async (Person_id) => {
    return await axios.get(`/api/events/upcoming/user/${Person_id}`).then((r) => r.data);
  },

  fetchEventChain: async (Activity_Name) => {
    return await axios.get(`/api/event/${Activity_Name}/chain`).then((r) => r.data);
  },

  fetchClosestEvents: async (Person_id, Date_End = "2021-10-31") => {
    return await axios.get(`/api/events/closest/user/${Person_id}/until/${Date_End}`).then((r) => r.data);
  },

  fetchFilteredEvents: async (data) => {
    return await axios.post("/api/events/filtered", data).then((r) => r.data);
  },

  fetchEventsInfo: async () => {
    return await axios.get("/api/events/info").then((r) => r.data);
  },

  fetchChildEvents: async (Activity_Name) => {
    return await axios.get(`/api/event/${Activity_Name}/child`).then((r) => r.data);
  },

  postEvent: async (eventData) => {
    return await axios
      .post("/api/event", eventData)
      .then((r) => r.data)
      .catch((e) => e);
  },


  putEvent: async (eventData) => {
    return await axios
      .put("/api/event", eventData)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteEvent: async (Activity_Name) => {
    return await axios
      .delete(`/api/event/${Activity_Name}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchActivityTypes: async () => {
    return await axios.get("/api/activity-types").then((r) => r.data);
  },

  postActivityType: async (data) => {
    return await axios
      .post("/api/activity-type", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  putActivityType: async (data) => {
    return await axios
      .put("/api/activity-type", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteActivityType: async (Activity_type) => {
    return await axios
      .delete(`/api/activity-type/${Activity_type}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchActivityRequirements: async () => {
    return await axios.get("/api/activity-requirements").then((r) => r.data);
  },

  postActivityRequirement: async (data) => {
    return await axios
      .post("/api/activity-requirement", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  putActivityRequirement: async (data) => {
    return await axios
      .put("/api/activity-requirement", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteActivityRequirement: async (Parent, Child, Case_Type) => {
    return await axios
      .delete(`/api/activity-requirement/${Parent}/child/${Child}/case-type/${Case_Type}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchEventDocuments: async (Activity_Name) => {
    return await axios.get(`/api/event/${Activity_Name}/documents`).then((r) => r.data);
  },

  postEventDocument: async (data) => {
    return await axios
      .post("/api/event/document", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  putEventDocument: async (data) => {
    return await axios
      .put("/api/event/document", data)
      .then((r) => r.data)
      .catch((e) => e);
  },

  deleteEventDocument: async (Activity_Name, DOC_ID) => {
    return await axios
      .delete(`/api/event/${Activity_Name}/document/${DOC_ID}`)
      .then((r) => r.data)
      .catch((e) => e);
  },

  fetchRelationTypes: async () => {
    return await axios.get(`/api/relation-types`).then((r) => r.data);
  },

};

export default EventsApi;
