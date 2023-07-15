const express = require("express");
const router = express.Router();

module.exports = (publicController) => {
  // POST /events/create
  router.post("/", publicController.moveToPublic);
  router.delete("/:eventId", publicController.deleteFromPublic); 
  router.get("/", publicController.getFromPublic); 

  // Implement other event routes here

  return router;
};
