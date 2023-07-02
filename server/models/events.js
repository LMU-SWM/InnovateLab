const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventId: String,
  owner: String,
  ownerEmail: String,
  team: String,
  summary: String,
  description: String,
  location: String,
  startDateTime: Date,
  endDateTime: Date,
  timeZone: String,
  attendees: Array,
  googleCalendarEventId: String,
  calendarId: String
});

module.exports = mongoose.model("Event", EventSchema);
