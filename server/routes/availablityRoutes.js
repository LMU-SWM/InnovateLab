const express = require('express');
const router = express.Router();

module.exports = (availablityController) => {
  // Check availability of meeting owner
  router.post("/", availablityController.checkAvailability);

  return router;
};