const { google } = require("googleapis");
const EventModel = require("../models/events"); // Assuming you have an Event model
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ConnectionClosedEvent } = require("mongodb");


module.exports = (db) => {
  const createEvent = async (req, res) => {
    try {
      const auth = await google.auth.getClient({
        keyFile: "./auth.json",
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
      const { calendarId } = req.body;
      const uuid_eventId = uuidv4();
  
      const calendar = google.calendar({ version: "v3", auth });
  
      const event = {
        eventId: uuid_eventId,
        owner: req.body.owner,
        ownerEmail: req.body.ownerEmail,
        team: req.body.team,
        summary: req.body.summary || "",
        description: req.body.description || "",
        location: req.body.location || "",
        start: {
          dateTime: req.body.startDateTime || "",
          timeZone: req.body.timeZone || "",
        },
        end: {
          dateTime: req.body.endDateTime || "",
          timeZone: req.body.timeZone || "",
        },
        // Don't include attendees here
        // attendees: req.body.attendees || [],
        // Add any other optional parameters you want to include
      };
  
      // Check if the timeslot is available
      const eventsResponse = await calendar.events.list({
        calendarId: calendarId,
        timeMin: event.start.dateTime,
        timeMax: event.end.dateTime,
        singleEvents: true,
      });
  
      const existingEvents = eventsResponse.data.items;
      if (existingEvents && existingEvents.length > 0) {
        // There is already an event in the specified timeslot
        res.status(409).json({ error: "Timeslot is not available" });
        return;
      }
  
      const response = await calendar.events.insert({
        calendarId: calendarId, // Use the provided calendarId
        resource: event,
        sendUpdates: "none",
      });
  
      // Save the event to MongoDB
      const newEvent = new EventModel({
        eventId: event.eventId,
        owner: event.owner,
        ownerEmail: event.ownerEmail,
        team: event.team,
        summary: event.summary,
        description: event.description,
        location: event.location,
        startDateTime: event.start.dateTime,
        endDateTime: event.end.dateTime,
        timeZone: event.start.timeZone,
        attendees: req.body.attendees || [], // Save attendees to MongoDB only
        googleCalendarEventId: response.data.id, // Save the Google Calendar event ID
        calendarId: calendarId
      });
  
      // Save the calendar data in MongoDB
      const eventCollection = db.collection("events");
      await eventCollection.insertOne(newEvent);
  
      res.json({ message: "Event created successfully", event: response.data });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  };
  
  const getEvents = async (req, res) => {
    try {
      const { owner } = req.query; // Extract owner from query parameters
  
      // Define the query. If an owner is provided, filter events by owner.
      // If no owner is provided, the query will be an empty object and fetch all events.
      const query = owner ? { owner } : {};
  
      const eventCollection = db.collection("events");
      const events = await eventCollection.find(query).toArray();
  
      res.json(events);
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({ error: "Failed to get events" });
    }
  };

  const getEventById = async (req, res) => {
    try {
      const { owner, eventId } = req.query; // Extract owner and eventId from query parameters
  
      // Define the query. If an owner is provided, filter events by owner.
      // If an eventId is provided, filter events by eventId.
      // If neither owner nor eventId is provided, the query will be an empty object and fetch all events.
      const query = {};
      if (owner) query.owner = owner;
      if (eventId) query.eventId = eventId;
  
      const eventCollection = db.collection("events");
      const events = await eventCollection.find(query).toArray();
  
      if (eventId && events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      res.json(events);
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({ error: "Failed to get events" });
    }
  };

  const getEventByCalId = async (req, res) => {
    try {
      console.log("Start getEventByCalId");
      const { calendarId } = req.params; // Extract calendarId from query parameters
      console.log("calendarId:", calendarId);
      // Define the query. If a calendarId is provided, filter events by calendarId.
      const query = {};
      if (calendarId) {
        query.calendarId = calendarId;
      } else {
        return res.status(400).json({ error: "calendarId parameter is required" });
      }
  
      const eventCollection = db.collection("events");
      const events = await eventCollection.find(query).toArray();
  
      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      console.log("events:", events);
      res.json(events);
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({ error: "Failed to get events" });
    }
  };
  

  const modifyEvent = async (req, res) => {
    try {
      const auth = await google.auth.getClient({
        keyFile: "./auth.json",
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
  
      const calendar = google.calendar({ version: "v3", auth });
  
      // Get the event ID from the request
      const { eventId } = req.params;
      const query = eventId ? { eventId } : {};
  
      // Find the event in the MongoDB database
      const eventCollection = db.collection("events");
      const dbEvent = await eventCollection.findOne(query);


      if (!dbEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      // Check if the current user is the owner of the event
      if (req.body.user !== dbEvent.owner) {
        return res.status(403).json({ error: "You are not authorized to modify this event" });
      }
  
      const updatedEvent = {
        eventId: eventId,
        owner: dbEvent.owner,
        ownerEmail: dbEvent.ownerEmail,
        team: dbEvent.team,
        summary: req.body.summary || dbEvent.summary,
        description: req.body.description || dbEvent.description,
        location: req.body.location || dbEvent.location,
        startDateTime: req.body.startDateTime || dbEvent.startDateTime,
        endDateTime: req.body.endDateTime || dbEvent.endDateTime,
        timeZone: req.body.timeZone || dbEvent.timeZone,
        attendees: req.body.attendees || dbEvent.attendees,
        googleCalendarEventId: dbEvent.googleCalendarEventId,
        calendarId: dbEvent.calendarId,
      };
  
      const calEvent = {
        eventId: eventId,
        owner: dbEvent.owner,
        ownerEmail: dbEvent.ownerEmail,
        team: dbEvent.team,
        summary: req.body.summary || dbEvent.summary,
        description: req.body.description || dbEvent.description,
        location: req.body.location || dbEvent.location,
        start: {
          dateTime: req.body.startDateTime || dbEvent.startDateTime,
          timeZone: req.body.timeZone || dbEvent.timeZone,
        },
        end: {
          dateTime: req.body.endDateTime || dbEvent.endDateTime,
          timeZone: req.body.timeZone || dbEvent.timeZone,
        },
        // Don't include attendees here
        // attendees: req.body.attendees || [],
        // Add any other optional parameters you want to include
      };

      // Update the event in Google Calendar
      const googleResponse = await calendar.events.update({
        calendarId: dbEvent.calendarId, // Use the calendarId stored in MongoDB
        eventId: dbEvent.googleCalendarEventId, // Use the googleCalendarId stored in MongoDB
        resource: calEvent,
      });

      // Update the event in MongoDB
      await eventCollection.findOneAndUpdate(
        { eventId: eventId }, 
        { $set: updatedEvent }
      );
      
      res.json({ message: "Event updated successfully", event: googleResponse.data });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  };

  const deleteEvent = async (req, res) => {
    try {
      const auth = await google.auth.getClient({
        keyFile: "./auth.json",
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
  
      const calendar = google.calendar({ version: "v3", auth });
  
      // Get the event ID from the request
      const { eventId } = req.params;
  
      // Find the event in the MongoDB database
      const query = eventId ? { eventId } : {};
      const eventCollection = db.collection("events");
      const dbEvent = await eventCollection.findOne(query);

      if (!dbEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      // Check if the current user is the owner of the event
      if (req.body.user !== dbEvent.owner) {
        return res.status(403).json({ error: "You are not authorized to delete this event" });
      }
  
      // Delete the event from Google Calendar
      await calendar.events.delete({
        calendarId: dbEvent.calendarId, // Use the calendarId stored in MongoDB
        eventId: dbEvent.googleCalendarEventId, // Use the googleCalendarId stored in MongoDB
      });
  
      // Delete the event from MongoDB
      await eventCollection.deleteOne(
        { eventId: eventId }
      );

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  };

  return {
    createEvent,
    getEvents,
    getEventById,
    getEventByCalId,
    deleteEvent,
    modifyEvent,
  };
};
