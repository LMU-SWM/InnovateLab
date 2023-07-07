const { google } = require("googleapis");
const axios = require("axios");

module.exports = (db) => {
  // Step 5: Exchange Auth0 token for Google token
  const exchangeAuth0Token = async (auth0Token) => {
    try {
      const response = await axios.post(
        "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/oauth/token",
        {
          grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
          client_id: "LSGAVOEPkUZKjenwFeHJYaQKLQG1Ayo1",
          client_secret:
            "lRc3rQtPtWaEsxbm2uo9aJR_gbBCiFd2AbsiJ_At_K0cGNFwPxH4tZsziI8S6p6x",
          audience: "https://dev-gk1mwq7vzst50zhs.eu.auth0.com/api/v2/",
          subject_token: auth0Token,
          subject_token_type: "urn:ietf:params:oauth:token-type:access_token",
          scope: "openid email", // Add any additional scopes required
        }
      );
      console.log("Token:", response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error("Error exchanging Auth0 token:", error);
      throw new Error("Failed to exchange Auth0 token");
    }
  };

  // Step 6: Make API requests to Google Calendar
  const checkAvailability = async (req, res) => {
    try {
      console.log("Start");
      const auth0Token = req.headers.authorization.split(" ")[1]; // Assuming Auth0 token is provided in the Authorization header
      const googleToken = await exchangeAuth0Token(auth0Token);

      const auth = new google.auth.GoogleAuth({
        credentials: {
          access_token: googleToken,
        },
        scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
      });

      const calendar = google.calendar({ version: "v3", auth });

      const { calendarId, timeMin, timeMax } = req.body;

      // Retrieve user's events within the specified time range
      const response = await calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: "startTime",
      });

      // Extract the start and end times of each event
      const events = response.data.items || [];
      const busySlots = events.map((event) => ({
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }));

      // Calculate the free slots based on the busy slots
      // You can implement your own logic here to determine the free slots

      // Example: Assuming a single day with working hours from 9 AM to 5 PM
      const workingHours = [
        { start: "09:00", end: "10:00" },
        { start: "11:00", end: "12:00" },
        { start: "13:00", end: "14:00" },
        { start: "15:00", end: "16:00" },
      ];

      const freeSlots = workingHours.filter((hour) =>
        busySlots.every((slot) => {
          const slotStart = new Date(slot.start).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const slotEnd = new Date(slot.end).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return slotStart !== hour.start && slotEnd !== hour.end;
        })
      );

      res.json({ message: "Availability checked successfully", freeSlots });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ error: "Failed to check availability" });
    }
  };

  return {
    checkAvailability,
  };
};
