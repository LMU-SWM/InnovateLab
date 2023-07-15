const express = require("express");
const router = express.Router();

module.exports = (eventController) => {
  // POST /events/create
  router.post("/", eventController.createEvent);
  router.get("/", eventController.getEvents);
  router.get("/:eventId", eventController.getEventById);
  router.get('/calendar/:calendarId', eventController.getEventByCalId);
  router.delete("/:eventId", eventController.deleteEvent); // Delete event route
  router.put("/:eventId", eventController.modifyEvent); // Modify event route
  router.post("/assist", eventController.assist); 

  // Implement other event routes here

  return router;
};
