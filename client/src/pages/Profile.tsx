import { useAuth0 } from "@auth0/auth0-react";
import {
  Grid,
  Avatar,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";
import axios from "axios";

interface EventData {
  _id: string;
  eventId: string;
  owner: string;
  team: string;
  summary: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  timeZone: string;
  attendees: { email: string }[];
  googleCalendarEventId: string;
  calendarId: string;
}
function Profile(): JSX.Element {
  const { isAuthenticated, user, getIdTokenClaims } = useAuth0();

  const [calendars, setCalendars] = useState<any[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<any[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitColor, setSubmitColor] = useState("primary");



  const fetchCalendars = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.items; // Returns the list of calendars
      } else {
        throw new Error("Failed to fetch calendars");
      }
    } catch (error) {
      console.error("Error fetching calendars:", error);
      throw error;
    }
  };

  const fetchEvents = async (accessToken: string, calendarId: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.items; // Returns the list of events
      } else {
        throw new Error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };

  useEffect(() => {
    const getTokenAndSave = async () => {
      if (isAuthenticated) {
        const idTokenClaims = await getIdTokenClaims();
        if (idTokenClaims && idTokenClaims.__raw) {
          const userAuth0Token = idTokenClaims.__raw;
          localStorage.setItem("USER_AUTH0_TOKEN", userAuth0Token);
         
          console.log("User token stored:", userAuth0Token);
          // Decode the USER_AUTH0_TOKEN to access the payload
          const tokenPayload = JSON.parse(atob(userAuth0Token.split(".")[1]));
          // Access the userID from the token payload
          const userId = tokenPayload.sub;
          localStorage.setItem("USER_IL", user?.email||"");
          localStorage.setItem("USER_ID", tokenPayload.sub);
          // Use the userId as needed
          console.log("userID", userId);
          // Call the IdentityController's get route to fetch the data
          const response = await fetch(
            `http://localhost:3001/identity/user/${userId}/calendar/token`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${userAuth0Token}`,
              },
            }
          );

          // Parse the response JSON
          const data = await response.json();
          console.log("GOOGLE:", data);
          localStorage.setItem("GOOGLE_TOKEN", data.googleCalendarAccessToken);
          try {
            const googleCalendars = await fetchCalendars(
              data.googleCalendarAccessToken
            );
            console.log("Google Calendars:", googleCalendars);
            setCalendars(googleCalendars);
          } catch (e: any) {
            console.error("Error:", e);
          }
          // Log the returned JSON to the console
        } else {
          console.error("Error: ID token claims not available");
        }
      }
    };
    getTokenAndSave();
  }, [isAuthenticated, getIdTokenClaims]);

  const handleCalendarSelection = (calendar: any) => {
    if (selectedCalendars.includes(calendar)) {
      setSelectedCalendars((prevSelectedCalendars) =>
        prevSelectedCalendars.filter((c) => c.id !== calendar.id)
      );
    } else {
      setSelectedCalendars((prevSelectedCalendars) => [
        ...prevSelectedCalendars,
        calendar,
      ]);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    const selectedCalendarEvents: EventData[] = [];
    const googleToken: string = localStorage.getItem("GOOGLE_TOKEN") || "";
    const userToken: string = localStorage.getItem("USER_IL") || "";

    for (const calendar of selectedCalendars) {
      try {
        const events = await fetchEvents(googleToken, calendar.id);
        const updatedCalendars = selectedCalendarEvents.map((events) => {
          return {
            ...events,
            owner: userToken,
          };
        });
        selectedCalendarEvents.push(...events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    console.log("Selected Calendars:", selectedCalendars);
    //console.log("Events:", selectedCalendarEvents);

    const eventsJSON = JSON.stringify(selectedCalendarEvents);
    console.log("Events JSON:", eventsJSON);

    try {
      const response = await axios.post(
        "http://localhost:3001/persoanlEvents",
        {
          events: selectedCalendarEvents,
          owner: userToken,
        }
      );
      console.log("Server response:", response.data);
      setSubmitColor("success");
    } catch (error) {
      console.error("Error sending events to the server:", error);
      setSubmitColor("error");
    }
    setIsSubmitting(false);
  };

  return (
    <main style={{ padding: "1rem 0" }}>
      {isAuthenticated && (
        <Grid container>
          <Grid container justifyContent="center">
            <Grid item sx={{ m: 1 }}>
              <Avatar
                alt={user?.email}
                src={user?.picture}
                sx={{ width: 75, height: 75 }}
              />
            </Grid>
            <Grid item xs={12} sx={{ m: 1 }}>
              <TextField
                id="email"
                label="Email"
                value={user?.email}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sx={{ m: 1 }}>
              <TextField
                id="nickname"
                label="Nickname"
                value={user?.nickname}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      <section style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
        <Typography variant="h6" align="center" gutterBottom>
          Select your personal calendar(s) to use:
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <TableContainer style={{ width: "70%", border: "2px solid #fff" }}>
            <Table>
              <TableHead style={{ backgroundColor: "#b3e5fc" }}>
                <TableRow>
                  <TableCell>Calendar Name</TableCell>
                  <TableCell align="center">Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calendars.map((calendar, index) => (
                  <TableRow
                    key={calendar.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#e1f5fe" : "#ffffff",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {calendar.summary}
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={selectedCalendars.includes(calendar)}
                        onChange={() => handleCalendarSelection(calendar)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            style={{
              marginTop: "1rem",
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              backgroundColor:
                submitColor === "success"
                  ? "#4caf50"
                  : submitColor === "error"
                  ? "#f44336"
                  : undefined,
              color: "#ffffff",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}

export default Profile;
