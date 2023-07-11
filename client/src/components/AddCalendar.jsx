import axios from "axios";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import EventPopup from "./EventPopup";

export default function AddCalendar() {
  const [showModal, setShowModal] = useState(false);
  const [eventDataN, setEventDataN] = useState({});
  const calendarRef = useRef(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const [calendarId, setCalendarId] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const [roomEvents, setRoomEvents] = useState([]);
  const [fcRoomEvents, setFcRoomEvents] = useState([]);

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const serverURL_personalEvents = serverURL + "persoanlEvents";
  const serverURL_events = serverURL + "events";
  const serverURL_calendars = serverURL + "calendars";
  const serverURL_rooms = serverURL + "rooms";
  const serverURL_availablity = serverURL + "availablity";

  const authToken = "";

  console.log(calendarId, authToken);

  const handleRoomChange = async (event) => {
    const selectedRoom = event.target.value;
    setSelectedRoom(selectedRoom);

    try {
      const calendarResponse = await fetch(
        `${serverURL_calendars}/id?summary=${encodeURIComponent(selectedRoom)}`
      );
      const calendarData = await calendarResponse.json();
      setSelectedCalendar(calendarData.id);
    } catch (error) {
      console.log("Error fetching calendar options:", error);
    }
  };

  const handleDateClick = (info) => {
    setShowModal(true);
    setEventDataN({
      start: info.dateStr,
      end: info.dateStr,
    });
    setLoading(true);
    calendarRef.current.getApi().refetchEvents();
    setLoading(false);
  };

  const handleEventClick = (info) => {
    // Prevent redirect to Google Calendar
    info.jsEvent.cancelBubble = true;
    info.jsEvent.preventDefault();
    console.log(info);
    setShowModal(true);
    setEventDataN({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
    });
  };

  const handleEventChange = (newData) => {
    setEventDataN(newData);
  };

  const handleSaveEvent = async () => {
    try {
      const newEvent = {
        summary: eventDataN.summary,
        location: eventDataN.location,
        start: {
          dateTime:
            eventDataN.start.length < 20
              ? `${eventDataN.start}T10:00:00`
              : eventDataN.start, // Add a default time of 10:00:00 if no time is provided,
          timeZone: "Europe/Berlin",
        },
        end: {
          dateTime:
            eventDataN.end.length < 20
              ? `${eventDataN.end}T17:00:00`
              : eventDataN.end, // Add a default time of 17:00:00 if no time is provided
          timeZone: "Europe/Berlin",
        },
      };

      // Your code to add the event to Google Calendar...
      console.log(newEvent);
      const response = await axios({
        method: "post",
        url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,

        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        data: newEvent,
      });

      if (response.status === 200) {
        console.log("Event added to Google Calendar");
        setLoading(true);
        calendarRef.current.getApi().refetchEvents();
        setLoading(false);
      } else {
        console.error(
          "Error adding event to Google Calendar:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }

    setShowModal(false);
    setEventDataN({});
  };

  const handleDeleteEvent = async () => {
    let eventId = eventDataN.id;
    try {
      console.log(eventId);
      const response = await axios({
        method: "delete",
        url: `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar}/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 204) {
        console.log("Event deleted from Google Calendar");
        calendarRef.current.getApi().refetchEvents();
      } else {
        console.error(
          "Error deleting event from Google Calendar:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleCancelEvent = () => {
    setShowModal(false);
    setEventDataN({});
  };

  const handleCheckAvailability = () => {
    console.log("Start");
    const auth0Token = localStorage.getItem("USER_AUTH0_TOKEN");
    console.log("Token: ", auth0Token);

    fetch("http://localhost:3001/availablity/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth0Token}`,
      },
      body: JSON.stringify({
        calendarId: "sujaycjoshy@gmail.com", // Replace with the user's Google Calendar ID
        timeMin: "2023-07-04T09:00:00", // Replace with the desired start time
        timeMax: "2023-07-04T17:00:00", // Replace with the desired end time
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response data as needed
      })
      .catch((error) => {
        console.error("Error checking availability:", error);
      });
  };

  useEffect(() => {
    // Refresh events every 10 seconds
    const interval = setInterval(() => {
      calendarRef.current.getApi().refetchEvents();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchRoomAndCalendarOptions = async () => {
      try {
        // Fetch the room options from the server
        const roomResponse = await fetch("http://localhost:3001/rooms/");
        const roomData = await roomResponse.json();
        setRoomOptions(roomData);
      } catch (error) {
        console.log("Error fetching room and calendar options:", error);
      }
    };

    fetchRoomAndCalendarOptions();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setRoomEvents([]);
        // Fetch events from the server
        const encodedCalendar = encodeURIComponent(selectedCalendar);
        console.log("URL:", serverURL_events + "/calendar/" + encodedCalendar);
        const response = await fetch(
          serverURL_events + "/calendar/" + encodedCalendar
        );
        const eventsData = await response.json();

        const formattedEvents = eventsData.map((event) => ({
          id: event.eventId,
          title: event.summary,
          start: event.startDateTime, // Assuming your event object has a 'startDateTime' property
          end: event.endDateTime, // Assuming your event object has an 'endDateTime' property
          backgroundColor: "blue", // Optional: Customize background color if needed
          borderColor: "blue", // Optional: Customize border color if needed
          textColor: "white", // Optional: Customize text color if needed
          // Additional properties as needed
        }));

        // Set the events state
        setRoomEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [selectedCalendar]);

  useEffect(() => {
    const fetchPersonalEvents = async () => {
      try {
        setFcRoomEvents([]);
        // Fetch events from the server
        const owner = localStorage.getItem("USER_IL") || "";
        const encodedOwner = encodeURIComponent(owner);
        console.log("URL:", serverURL_personalEvents + "/" + encodedOwner);
        const response = await fetch(
          serverURL_personalEvents + "/" + encodedOwner
        );
        const eventsData = await response.json();

        const formattedEvents = eventsData.map((event) => ({
          id: event.eventId,
          title: event.summary,
          start: event.startDateTime, // Assuming your event object has a 'startDateTime' property
          end: event.endDateTime, // Assuming your event object has an 'endDateTime' property
          backgroundColor: "red", // Optional: Customize background color if needed
          borderColor: "red", // Optional: Customize border color if needed
          textColor: "white", // Optional: Customize text color if needed
          // Additional properties as needed
        }));

        // Set the events state
        setFcRoomEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchPersonalEvents();
  }, [selectedCalendar]);

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("roomEvents:", roomEvents);
  }, [roomEvents]);

  useEffect(() => {
    console.log("fcRoomEvents:", fcRoomEvents);
  }, [fcRoomEvents]);

  return (
    <div className="calendar">
      {/* Render the selectors with options */}
      <div>
        <label htmlFor="room">Room:</label>
        <select id="room" value={selectedRoom} onChange={handleRoomChange}>
          <option value="">Select Room</option>
          {roomOptions.map((room, index) => (
            <option key={index} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>

      </div>
      <EventPopup
        isOpen={showModal}
        eventData={eventDataN}
        onChange={handleEventChange}
        onSave={handleSaveEvent}
        onCancel={handleCancelEvent}
        onDelete={handleDeleteEvent}
        onCheckAvailability={handleCheckAvailability}
      />

      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          googleCalendarPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={[...roomEvents, ...fcRoomEvents]}
      />
    </div>
  );
}
