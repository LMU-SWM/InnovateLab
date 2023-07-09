const express = require("express");
const router = express.Router();

module.exports = (identityController) => {
  
  //Rooms
  // Get a Identity Provider Access token
  router.get("/user/:userId/calendar/token", identityController.getIdentity);

  return router;
};