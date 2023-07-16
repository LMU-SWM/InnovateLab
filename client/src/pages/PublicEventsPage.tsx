import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";

interface Event {
  _id: string;
  eventId: string;
  owner: string;
  ownerEmail: string;
  team: string | null;
  summary: string;
  description: string;
  image: string;
  location: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export default function PublicEventsPage() {
  const { isAuthenticated } = useAuth0();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3001/public");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleRegistration = (eventId: string) => {
    console.log("Register for event with ID:", eventId);
    // Add your logic for registration here
  };

  return (
    <main style={{ padding: "1rem 0" }}>
      <Box
        style={{
          padding: "4rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Events happening at SWM
        </Typography>
        <Typography variant="subtitle1" component="p">
          Join us!
        </Typography>
      </Box>
      {isAuthenticated && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            backgroundImage: "url(https://cdn.casafari.com/wp-content/uploads/2022/05/Munich-as-seen-from-above-scaled.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginTop: "-50px", // Adjust this value as needed
            paddingTop: "50px", // Adjust this value as needed
            position: "relative",
            zIndex: 1,
          }}
        >
          {events.map((event) => (
            <Card
              key={event.eventId}
              style={{ width: "300px", margin: "1rem" }}
            >
              {event.image ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image}
                  alt=""
                />
              ) : (
                <Box
                  height={200}
                  bgcolor="lightgrey"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="body1" color="textSecondary">
                    Image Placeholder
                  </Typography>
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" component="h3">
                  {event.summary}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleRegistration(event.eventId)}
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
