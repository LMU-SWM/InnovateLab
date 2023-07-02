const express = require('express');
const router = express.Router();

module.exports = (calendarController) => {
  // POST /calendars
  router.post('/', calendarController.createCalendar);

  // DELETE /calendars/:calendarId
  router.delete('/:calendarId', calendarController.deleteCalendar);

  // List calendars
  router.get('/', calendarController.listCalendars);

  // Summary to ID
  router.get('/id', calendarController.getCalendarIdBySummary);

  return router;
};
