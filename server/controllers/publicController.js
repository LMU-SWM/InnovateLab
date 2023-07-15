const { google } = require("googleapis");
const EventModel = require("../models/events"); // Assuming you have an Event model
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { ConnectionClosedEvent } = require("mongodb");

module.exports = (db) => {
  const moveToPublic = async (req, res) => {
    try {
      const uuid_eventId = uuidv4();
      const event = {
        eventId: uuid_eventId,
        owner: "ADMIN",
        ownerEmail: "ADMIN",
        team: req.body.team,
        summary: req.body.summary || "",
        description: req.body.description || "",
        image: req.body.image || "",
        location: req.body.location || "",
        start: {
          dateTime: req.body.startDateTime || "",
          timeZone: req.body.timeZone || "",
        },
        end: {
          dateTime: req.body.endDateTime || "",
          timeZone: req.body.timeZone || "",
        },
      };

      // Create a new collection named "PublicEvents" and insert the event there
      const publicEventCollection = db.collection("PublicEvents");
      await publicEventCollection.insertOne(event);

      res.json(event);
    } catch (error) {
      console.error("Error getting event:", error);
      res.status(500).json({ error: "Failed to get event" });
    }
  };

  const deleteFromPublic = async (req, res) => {
    try {
      // Delete the event from the "PublicEvents" collection based on the eventId
      const publicEventCollection = db.collection("PublicEvents");
      const result = await publicEventCollection.deleteMany({});

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Event deleted from PublicEvents collection" });
    } catch (error) {
      console.error("Error deleting event from PublicEvents:", error);
      res
        .status(500)
        .json({ error: "Failed to delete event from PublicEvents" });
    }
  };

  const getFromPublic = async (req, res) => {
    try {
      const owner = "ADMIN";
      const query = owner ? { owner } : {};
      // Find the event from the "PublicEvents" collection based on the eventId
      const publicEventCollection = db.collection("PublicEvents");
      const events = await publicEventCollection.find(query).toArray();
      res.json(events);
    } catch (error) {
      console.error("Error getting event from PublicEvents:", error);
      res.status(500).json({ error: "Failed to get event from PublicEvents" });
    }
  };

  return {
    moveToPublic,
    deleteFromPublic,
    getFromPublic,
  };
};
