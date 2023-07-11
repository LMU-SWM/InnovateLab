const EventModel = require("../models/events"); // Assuming you have an Event model

module.exports = (db) => {
  const personalEvents = async (req, res) => {
    try {
      const { events,owner } = req.body;
        
      const eventCollection = db.collection("personalEvents");
      //  Delete existing events in the "personalevents" cluster
      //  await EventModel.deleteMany({});
      //  await eventCollection.deleteMany({});

      //console.log("Events:", events);
      const storedEvents = [];
        let count = 0;
      for (const eventData of events) {
        const newEvent = new EventModel({
          eventId: eventData.eventId,
          owner: owner,
          ownerEmail: eventData.organizer.email,
          team: '',
          summary: eventData.summary,
          description: eventData.summary,
          location: '',
          startDateTime: eventData.start.dateTime,
          endDateTime: eventData.end.dateTime,
          timeZone: eventData.start.timeZone,
          googleCalendarEventId: '',
          calendarId: '',
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

  const personalEventsDelete = async (req, res) => {
    try {
      console.log("Delete called")
      const eventCollection = db.collection("personalEvents");
      await eventCollection.deleteMany({});
      console.log("Delete completed")
      res.json({ message: "Personal Events deleted successfully"});
    } catch (error) {
      console.error("Error storing events:", error);
      res.status(500).json({ error: "Failed to store events" });
    }
  };

  const personalEventsGet = async (req, res) => {
    try {
      console.log("Get called")
      const { owner } = req.params; // Extract calendarId from query parameters
      console.log("owner:"+ owner);
      // Define the query. If a calendarId is provided, filter events by calendarId.
      const query = {};
      if (owner) {
        query.owner = owner;
      } else {
        return res.status(400).json({ error: "owner parameter is required" });
      }
  
      const eventCollection = db.collection("personalEvents");
      console.log(query);
      const events = await eventCollection.find(query).toArray();
  
      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      console.log("events:", events);
      res.json(events);
    } catch (error) {
      console.error("Error storing events:", error);
      res.status(500).json({ error: "Failed to store events" });
    }
  };

  return {
    personalEvents,
    personalEventsDelete,
    personalEventsGet
  };
};
