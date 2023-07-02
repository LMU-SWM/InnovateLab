const express = require("express");
const router = express.Router();

module.exports = (eventController) => {
  // POST /events/create
  router.post("/", eventController.createEvent);
  router.get("/", eventController.getEvents);
  router.delete("/:eventId", eventController.deleteEvent); // Delete event route
  router.put("/:eventId", eventController.modifyEvent); // Modify event route

  // Implement other event routes here

  return router;
};
