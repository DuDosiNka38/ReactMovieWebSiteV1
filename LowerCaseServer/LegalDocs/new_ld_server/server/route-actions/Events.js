const DataChecker = require("../services/DataChecker");
const EventsService = require("../services/Events");

const Events = {
  getEvent: async (req, res) => {        
    const Events = await EventsService.getEvent(req.hostId, req.params);
    res.send(Events);
  },
  getEventsInfo: async (req, res) => {        
    const Events = await EventsService.getEventsInfo(req.hostId);
    res.send(Events);
  },
  getEvents: async (req, res) => {        
    const Events = await EventsService.getEvents(req.hostId);
    res.send(Events);
  },
  getChildEvents: async (req, res) => {        
    const Events = await EventsService.getChildEvents(req.hostId, req.params);
    res.send(Events);
  },
  getCaseEvents: async (req, res) => {        
    const Events = await EventsService.getCaseEvents(req.hostId, req.params);
    res.send(Events);
  },
  getUserEvents: async (req, res) => {        
    const Events = await EventsService.getUserEvents(req.hostId, req.params);
    res.send(Events);
  },
  getUserUpcomingEvents: async (req, res) => {        
    const Events = await EventsService.getUserUpcomingEvents(req.hostId, req.params);
    res.send(Events);
  },
  getFilteredEvents: async (req, res) => {        
    const Events = await EventsService.getFilteredEvents(req.hostId, req.body);
    res.send(Events);
  },

  insertEvent: async (req, res) => {
    const result = await EventsService.insertEvent(req.hostId, req.body);
    res.send(result);
  },

  updateEvent: async (req, res) => {
    const result = await EventsService.updateEvent(req.hostId, req.body.Activity_Name, req.body);
    res.send(result);
  },

  deleteEvent: async (req, res) => {
    const result = await EventsService.deleteEvent(req.hostId, req.params);
    res.send(result);
  },

  
  getEventDocuments: async (req, res) => {        
    const Events = await EventsService.getEventDocuments(req.hostId, req.params.Activity_Name);
    res.send(Events);
  },

  
  getEventChain: async (req, res) => {     
    const Events = await EventsService.getEventChain(req.hostId, req.params);
    res.send(Events);
  },

  
  getClosestEvents: async (req, res) => {     
    const Events = await EventsService.getClosestEvents(req.hostId, req.params);
    res.send(Events);
  },

  insertEventDocument: async (req, res) => {
    const result = await EventsService.insertEventDocument(req.hostId, req.body);
    res.send(result);
  },

  updateEventDocument: async (req, res) => {
    const result = await EventsService.updateEventDocument(req.hostId, req.body.Activity_Name, req.body.DOC_ID, req.body);
    res.send(result);
  },

  deleteEventDocument: async (req, res) => {
    const result = await EventsService.deleteEventDocument(req.hostId, req.params);
    res.send(result);
  },
};

module.exports = Events;