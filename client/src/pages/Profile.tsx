import { useAuth0 } from "@auth0/auth0-react";
import { Grid, Avatar, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import createAuth0Client, { Auth0Client } from "@auth0/auth0-spa-js";

function Profile() {
  const { isAuthenticated, user, getIdTokenClaims } = useAuth0();

  const [calendars, setCalendars] = useState([]);

  const fetchCalendars = async (accessToken: String) => {
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
          console.log("GOOGLE:", data.googleCalendarAccessToken);
          try {
            const googleCalendars = await fetchCalendars(
              data.googleCalendarAccessToken
            );
            console.log("Google Calendars:", googleCalendars);
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
    </main>
  );
}

export default Profile;