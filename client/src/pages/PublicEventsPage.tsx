import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AddCalendar from "../components/AddCalendar";

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
      {isAuthenticated && (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {events.map((event) => (
          <div key={event.eventId} style={{ width: "300px", margin: "1rem" }}>
            <img src={event.image} alt="" style={{ width: "100%", height: "auto" }} />
            <h3>{event.summary}</h3>
            <p>{event.description}</p>
            <p>{event.location}</p>
            <button onClick={() => handleRegistration(event.eventId)}>Register</button>
          </div>
        ))}
      </div>
      )}
    </main>
  );
}
