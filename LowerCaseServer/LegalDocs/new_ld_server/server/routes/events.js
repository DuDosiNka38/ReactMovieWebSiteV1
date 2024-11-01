const express = require("express"); 
const { 
  getEvents, 
  getCaseEvents, 
  getEvent, 
  insertEvent, 
  updateEvent, 
  deleteEvent,

  getEventDocuments,
  insertEventDocument,
  updateEventDocument,
  deleteEventDocument,
  getUserEvents,
  getFilteredEvents,
  getEventsInfo,
  getChildEvents,
  getUserUpcomingEvents,
  getEventChain,
  getClosestEvents
} = require("../route-actions/Events");

const Functions = require("../lib/Functions");
const { deleteDocument } = require("../services/Documents");

const eventRouter = express.Router();
const jsonParser = express.json();

//Auth Listeners
eventRouter.use(Functions.isValidSession);

eventRouter.get("/events", getEvents);
eventRouter.get("/events/info", getEventsInfo);
eventRouter.get("/events/case/:Case_NAME", getCaseEvents);
eventRouter.get("/events/user/:Person_id", getUserEvents);
eventRouter.get("/event/:Activity_Name", getEvent);
eventRouter.get("/event/:Parent_Activity_Name/child", getChildEvents);
eventRouter.post("/events/filtered", jsonParser, getFilteredEvents);

eventRouter.post("/event", jsonParser, insertEvent);
eventRouter.put("/event", jsonParser, updateEvent);
eventRouter.delete("/event/:Activity_Name", deleteEvent);

eventRouter.get("/event/:Activity_Name/documents", getEventDocuments);
eventRouter.post("/event/document", jsonParser, insertEventDocument);
eventRouter.put("/event/document", jsonParser, updateEventDocument);
eventRouter.delete("/event/:Activity_Name/document/:DOC_ID", jsonParser, deleteEventDocument);

eventRouter.get("/events/upcoming/user/:Person_id/", getUserUpcomingEvents)
eventRouter.get("/event/:Activity_Name/chain", getEventChain);
eventRouter.get("/events/closest/user/:Person_id/until/:Date_End", getClosestEvents);




module.exports = eventRouter;