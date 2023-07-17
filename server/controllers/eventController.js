const { google } = require("googleapis");
const EventModel = require("../models/events"); // Assuming you have an Event model
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
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
      // const eventsResponse = await calendar.events.list({
      //   calendarId: calendarId,
      //   timeMin: event.start.dateTime,
      //   timeMax: event.end.dateTime,
      //   singleEvents: true,
      // });

      // const existingEvents = eventsResponse.data.items;
      // if (existingEvents && existingEvents.length > 0) {
      //   // There is already an event in the specified timeslot
      //   res.status(409).json({ error: "Timeslot is not available" });
      //   return;
      // }

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
        calendarId: calendarId,
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

  const moveToPublic = async (req, res) => {
    try {
      const uuid_eventId = uuidv4();
      const event = {
        eventId: uuid_eventId,
        owner: ADMIN,
        ownerEmail: ADMIN,
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

      res.json(events);
    } catch (error) {
      console.error("Error getting events:", error);
      res.status(500).json({ error: "Failed to get events" });
    }
  };

  const deleteFromPublic = async (req, res) => {
    try {
      const eventId = req.params.eventId; // Extract the eventId from the request parameters

      // Delete the event from the "PublicEvents" collection based on the eventId
      const publicEventCollection = db.collection("PublicEvents");
      const result = await publicEventCollection.deleteOne({ eventId });

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
      // Find the event from the "PublicEvents" collection based on the eventId
      const publicEventCollection = db.collection("PublicEvents");
      const events = await eventCollection.toArray();
      res.json(events);
    } catch (error) {
      console.error("Error getting event from PublicEvents:", error);
      res.status(500).json({ error: "Failed to get event from PublicEvents" });
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
      //console.log("calendarId:", calendarId);
      // Define the query. If a calendarId is provided, filter events by calendarId.
      const query = {};
      if (calendarId) {
        query.calendarId = calendarId;
      } else {
        return res
          .status(400)
          .json({ error: "calendarId parameter is required" });
      }

      const eventCollection = db.collection("events");
      const events = await eventCollection.find(query).toArray();

      if (events.length === 0) {
        return res.status(404).json({ error: "Event not found" });
      }
      //console.log("events:", events);
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
        return res
          .status(403)
          .json({ error: "You are not authorized to modify this event" });
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

      res.json({
        message: "Event updated successfully",
        event: googleResponse.data,
      });
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
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this event" });
      }

      // Delete the event from Google Calendar
      await calendar.events.delete({
        calendarId: dbEvent.calendarId, // Use the calendarId stored in MongoDB
        eventId: dbEvent.googleCalendarEventId, // Use the googleCalendarId stored in MongoDB
      });

      // Delete the event from MongoDB
      await eventCollection.deleteOne({ eventId: eventId });

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  };

  const getEventsFunction = async (start, end) => {
    try {
      // Convert start and end strings to ISO 8601 date strings
      const startDateString = new Date(start).toISOString();
      const endDateString = new Date(end).toISOString();
    
      const eventCollection = db.collection("events");
      
      const pipeline = [
        {
          $addFields: {
            startDateTimeDate: {
              $dateFromString: {
                dateString: "$startDateTime"
              }
            }
          }
        },
        {
          $match: {
            startDateTimeDate: {
              $gte: new Date(startDateString),
              $lte: new Date(endDateString)
            }
          }
        },
        {
          $project: {
            startDateTimeDate: 0 // remove this field if you don't want it in your results
          }
        }
      ];
      
      const events = await eventCollection.aggregate(pipeline).toArray();
    
      return events;
    } 
    catch (error) {
      console.error("Error getting events:", error);
      return [];
    }
  };
  
  const deleteEventFunction = async (eventId) => {
    try {
      // Retrieve the event from the MongoDB database
      const eventCollection = db.collection("events");
      const dbEvent = await eventCollection.findOne({ eventId });

      if (!dbEvent) {
        throw new Error("Event not found");
      }

      // Delete the event from Google Calendar
      const auth = await google.auth.getClient({
        keyFile: "./auth.json",
        scopes: ["https://www.googleapis.com/auth/calendar.events"],
      });
      const calendar = google.calendar({ version: "v3", auth });
      await calendar.events.delete({
        calendarId: dbEvent.calendarId,
        eventId: dbEvent.googleCalendarEventId,
      });

      // Delete the event from MongoDB
      await eventCollection.deleteOne({ eventId });

      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error("Failed to delete event");
    }
  };

  const deleteRangeEvent = async (req, res) => {
    try {
      const start = req.body.start;
      const end = req.body.end;

      const eventsList = await getEventsFunction(start, end);
      console.log("Events to delete:", eventsList);
      eventsList.forEach((event) => {
        deleteEventFunction(event.eventId)
          .then(() => {
            console.log(`Event ${event.eventId} deleted successfully`);
          })
          .catch((error) => {
            res.status(500).json({ error: "Failed to delete event" });
          });
      });
      res.json({ message: "Events deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  };

  // timeslotController.js
  const getAvailableTimeSlots = function (
    personalEvents,
    officialEvents,
    possibleRooms,
    preferredDate,
    preferredTime,
    duration
  ) {
    // Function Definitions:
    let safetyCounter = 0;

    function parseDateAsUTC(dateString) {
      const [date, time] = dateString.split("T");
      const [year, month, day] = date.split("-").map(Number);
      const [hour, minute, second] = time
        .replace(".000Z", "")
        .split(":")
        .map(Number);

      return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    }

    const getNonConflictingSlots = (slots, events) => {
      if (!Array.isArray(slots) || !Array.isArray(events)) {
        throw new Error("Both slots and events must be arrays");
      }

      const conflicts = [];
      //console.log("events:", events)
      slots.forEach((slot) => {
        events.forEach((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          //console.log(eventStart,eventEnd);
          if (
            (eventStart >= slot.start && eventStart < slot.end) ||
            (eventEnd > slot.start && eventEnd <= slot.end) ||
            (eventStart <= slot.start && eventEnd >= slot.end)
          ) {
            conflicts.push(slot);
          }
        });
      });

      const nonConflictingSlots = slots.filter(
        (slot) => !conflicts.some((conflict) => areSlotsEqual(slot, conflict))
      );

      return nonConflictingSlots;
    };

    const getEquallyDividedSlots = (duration, startTime, endTime, room) => {
      if (!Number.isInteger(duration)) {
        throw new Error("Duration must be an integer");
      }
      const slots = [];
      const currentTime = new Date(startTime);

      while (currentTime < endTime) {
        //console.log("Current Time:", currentTime)
        //console.log("endTime:", endTime)
        const slotStart = new Date(currentTime);
        const slotEnd = new Date(currentTime.getTime() + duration * 60 * 1000);
        //console.log("slotEnd:", slotEnd)
        if (slotEnd <= endTime) {
          slots.push({
            start: slotStart,
            end: slotEnd,
            room: room,
          });
        }

        currentTime.setTime(slotStart.getTime() + 30 * 60 * 1000);
      }

      return slots;
    };

    const getPossibleSlots = (
      events,
      startTime,
      endTime,
      duration,
      possibleRooms
    ) => {
      if (!Array.isArray(possibleRooms)) {
        throw new Error("possibleRooms must be an array");
      }

      let potentialEvents = [];

      const eventsByRoom = groupEventsByRoom(events);

      for (let room of possibleRooms) {
        let allPossibleSlots = getEquallyDividedSlots(
          duration,
          startTime,
          endTime,
          room
        );
        //console.log("allPossibleSlots:", allPossibleSlots);
        let roomEvents = eventsByRoom[room] || [];
        //console.log("roomEvents:", eventsByRoom);
        const nonConflictingSlots = getNonConflictingSlots(
          allPossibleSlots,
          roomEvents
        );
        potentialEvents.push(...nonConflictingSlots);
      }
      return potentialEvents;
    };

    const groupEventsByRoom = (events) => {
      if (!Array.isArray(events)) {
        throw new Error("events must be an array");
      }

      return events.reduce((groupedEvents, event) => {
        (groupedEvents[event.room] = groupedEvents[event.room] || []).push(
          event
        );
        return groupedEvents;
      }, {});
    };

    // Helper function to check if two time slots are equal
    function areSlotsEqual(slot1, slot2) {
      if (typeof slot1 !== "object" || typeof slot2 !== "object") {
        throw new Error("Both slot1 and slot2 must be objects");
      }

      return (
        slot1.start.getTime() === slot2.start.getTime() &&
        slot1.end.getTime() === slot2.end.getTime() &&
        slot1.room === slot2.room
      );
    }

    // Main Function:

    if (
      !Array.isArray(personalEvents) ||
      !Array.isArray(officialEvents) ||
      !Array.isArray(possibleRooms) ||
      !preferredDate ||
      !preferredTime ||
      !duration
    ) {
      throw new Error(
        "Invalid inputs. Please ensure all inputs are correctly formatted."
      );
    }

    const timeSlots = {
      morning: [
        new Date(`${preferredDate}T12:00:00`),
        new Date(`${preferredDate}T14:00:00`),
      ],
      afternoon: [
        new Date(`${preferredDate}T14:00:00`),
        new Date(`${preferredDate}T16:00:00`),
      ],
      evening: [
        new Date(`${preferredDate}T16:00:00`),
        new Date(`${preferredDate}T20:00:00`),
      ],
      allday: [
        new Date(`${preferredDate}T10:00:00`),
        new Date(`${preferredDate}T18:00:00`),
      ],
    };

    if (!timeSlots.hasOwnProperty(preferredTime)) {
      throw new Error(
        "Preferred time must be 'morning', 'afternoon', or 'evening'"
      );
    }

    const [startTime, endTime] = timeSlots[preferredTime];
    const allEvents = [...officialEvents];
    const eventsByRoom = groupEventsByRoom(allEvents);
    let availableTimeSlots = [];
    let currentDate = new Date(preferredDate);

    while (availableTimeSlots.length < 10) {
      let currentDayEvents = [];
      for (const roomName of possibleRooms) {
        let events = Object.values(eventsByRoom[roomName]);
        // Filter the events that are running during the current day for each room
        for (const event of events) {
          if (
            event.start.split("T")[0] ===
            currentDate.toISOString().split("T")[0]
          ) {
            currentDayEvents.push(event);
          }
        }
      }
      //console.log("currentDayEvents:", currentDayEvents);
      let potentialTimeSlots = getPossibleSlots(
        currentDayEvents,
        startTime,
        endTime,
        duration,
        possibleRooms
      );
      //console.log("potentialTimeSlots:", potentialTimeSlots);
      const validEvents = personalEvents.filter(
        (event) => event.start && event.end
      );
      let nonConflictingTimeSlots = getNonConflictingSlots(
        potentialTimeSlots,
        validEvents
      );
      console.log(startTime, endTime);
      availableTimeSlots.push(...nonConflictingTimeSlots);
      console.log("availableTimeSlots:", availableTimeSlots);

      if (availableTimeSlots.length < 10) {
        if (currentDate.getDay() !== new Date(preferredDate).getDay()) {
          currentDate.setDate(new Date(preferredDate).getDate() + 7);
        } else {
          currentDate.setDate(currentDate.getDate() + 1);
        }
        startTime.setFullYear(currentDate.getFullYear());
        startTime.setMonth(currentDate.getMonth());
        startTime.setDate(currentDate.getDate());
        endTime.setFullYear(currentDate.getFullYear());
        endTime.setMonth(currentDate.getMonth());
        endTime.setDate(currentDate.getDate());
      }
      safetyCounter++;
      if (safetyCounter > 5) {
        throw new Error(
          "Exceeded safety limit while searching for available time slots."
        );
      }
    }

    availableTimeSlots.sort((a, b) => new Date(a.start) - new Date(b.start));
    return availableTimeSlots.slice(0, 10);
  };

  const assist = async (req, res) => {
    try {
      const {
        personalEvents,
        officialEvents,
        possibleRooms,
        preferredDate,
        preferredTime,
        duration,
      } = req.body;
      //console.log("preferredDate:",preferredDate);
      const availableSlots = getAvailableTimeSlots(
        personalEvents,
        officialEvents,
        possibleRooms,
        preferredDate,
        preferredTime,
        duration
      );

      res.json(availableSlots);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  return {
    createEvent,
    getEvents,
    getEventById,
    getEventByCalId,
    deleteEvent,
    modifyEvent,
    assist,
    moveToPublic,
    deleteFromPublic,
    getFromPublic,
    deleteRangeEvent,
  };
};
