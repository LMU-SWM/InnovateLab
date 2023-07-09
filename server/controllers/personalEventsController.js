const EventModel = require("../models/events"); // Assuming you have an Event model

module.exports = (db) => {
  const personalEvents = async (req, res) => {
    try {
      const { events } = req.body;
        
      const eventCollection = db.collection("personalEvents");
      // Delete existing events in the "personalevents" cluster
      //await EventModel.deleteMany({});
      await eventCollection.deleteMany({});

      console.log("Events:", events);
      const storedEvents = [];
        let count = 0;
      for (const eventData of events) {
        const newEvent = new EventModel({
          eventId: eventData.eventId,
          owner: eventData.owner,
          ownerEmail: eventData.ownerEmail,
          team: eventData.team,
          summary: eventData.summary,
          description: eventData.description,
          location: eventData.location,
          startDateTime: eventData.startDateTime,
          endDateTime: eventData.endDateTime,
          timeZone: eventData.timeZone,
          attendees: eventData.attendees,
          googleCalendarEventId: eventData.googleCalendarEventId,
          calendarId: eventData.calendarId,
        });

        // Save the event data in MongoDB
        await eventCollection.insertOne(newEvent);
        count++;
      }

      res.json({ message: "Personal Events stored successfully", count});
    } catch (error) {
      console.error("Error storing events:", error);
      res.status(500).json({ error: "Failed to store events" });
    }
  };

  return {
    personalEvents,
  };
};
