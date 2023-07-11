const express = require("express");
const router = express.Router();

module.exports = (personalEventsController) => {
  // POST /personal-events
  router.post("/", personalEventsController.personalEvents);
  router.delete("/", personalEventsController.personalEventsDelete);
  router.get("/:owner", personalEventsController.personalEventsGet);
  return router;
};
