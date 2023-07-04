const { google } = require("googleapis");
const { getServiceAccountAuth } = require("../services/googleCalendarService");
const { MongoClient } = require("mongodb");

module.exports = (db) => {
  const createCalendar = async (req, res) => {
    try {
      const auth = await google.auth.getClient({
        keyFile: "./auth.json",
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });

      const calendar = google.calendar({ version: "v3", auth });

      const { summary, timeZone} = req.body;

      const requestBody = {
        summary: summary || "My New Calendar",
        timeZone: timeZone || "UTC",
      };

      const response = await calendar.calendars.insert({
        requestBody,
      });

      const calendarData = response.data;

      // Save the calendar data in MongoDB
      const calendarsCollection = db.collection("calendars");
      await calendarsCollection.insertOne(calendarData);

      res.json({
        message: "Calendar created successfully",
        calendar: response.data,
      });
    } catch (error) {
      console.error("Error creating calendar:", error);
      res.status(500).json({ error: "Failed to create calendar" });
    }
  };

  const deleteCalendar = async (req, res) => {
    try {
      const auth = await getServiceAccountAuth();

      const calendar = google.calendar({ version: "v3", auth });

      await calendar.calendars.delete({
        calendarId: req.params.calendarId,
      });

      // Delete the calendar data from MongoDB
      const calendarsCollection = db.collection("calendars");
      const deletionResult = await calendarsCollection.deleteOne({ id: req.params.calendarId });
      
      if (deletionResult.deletedCount === 1) {
        res.json({ message: "Calendar deleted successfully" + req.params.calendarId  });
      } else {
        res.status(404).json({ error: "Calendar not found" });
      }

    } catch (error) {
      console.error("Error deleting calendar:", error);
      res.status(500).json({ error: "Failed to delete calendar" });
    }
  };

  const listCalendars = async (req, res) => {
    try {
      const auth = await getServiceAccountAuth();

      const calendar = google.calendar({ version: "v3", auth });

      const response = await calendar.calendarList.list();

      const calendars = response.data.items;

      // Check if the calendars exist in MongoDB, and add them if missing
      const calendarsCollection = db.collection("calendars");

      for (const calendar of calendars) {
        const existingCalendar = await calendarsCollection.findOne({
          id: calendar.id,
        });
        if (!existingCalendar) {
          await calendarsCollection.insertOne(calendar);
        }
      }

      res.json({ message: "Calendars listed successfully", calendars });
    } catch (error) {
      console.error("Error listing calendars:", error);
      res.status(500).json({ error: "Failed to list calendars" });
    }
  };

  const getCalendarIdBySummary = async (req, res) => {
    try {
      const summary = req.query.summary; // Get the summary from the query parameter
  
      const calendarsCollection = db.collection('calendars');
      const calendar = await calendarsCollection.findOne({ summary });
  
      if (!calendar) {
        res.status(404).json({ error: 'Calendar not found' });
        return;
      }
  
      res.json({ id: calendar.id });
    } catch (error) {
      console.error('Error retrieving calendar ID:', error);
      res.status(500).json({ error: 'Failed to retrieve calendar ID' });
    }
  };
  
  // Implement other calendar-related functions like updateCalendar here
  return {
    createCalendar,
    deleteCalendar,
    listCalendars,
    getCalendarIdBySummary,
    // Export other calendar-related functions here
  };
};
