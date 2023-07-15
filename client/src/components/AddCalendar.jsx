import axios from "axios";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import EventPopup from "./EventPopup";
import { getRandomColor, getContrastText } from "../utils/utils";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

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
  const [attendees, setAttendees] = useState([]);
  const [newAttendee, setNewAttendee] = useState("");

  const serverURL = process.env.REACT_APP_SERVER_URL;
  const serverURL_personalEvents = serverURL + "persoanlEvents";
  const serverURL_events = serverURL + "events";
  const serverURL_calendars = serverURL + "calendars";
  const serverURL_rooms = serverURL + "rooms";
  const serverURL_availablity = serverURL + "availablity";
  const [zoomedInDate, setZoomedInDate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [bgColor, setBgColor] = useState({});
  const [txtColor, setTxtColor] = useState({});

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

  const updateTxtColor = (name, color) => {
    setTxtColor((prevColors) => ({
      ...prevColors,
      [name]: color,
    }));
  };

  const createDummyEvent = (date) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      title: "Your New Event",
      start: selectedDateTime,
      end: endDateTime,
      allDay: false,
      editable: true,
      durationEditable: true,
      backgroundColor: "green",
      borderColor: "dark green",
      extendedProps: {
        isDummyEvent: true,
      },
    });
  };

  const handleDateClick = (arg) => {
    if (calendarRef.current.getApi().view.type === "timeGridDay") {
      setSelectedDateTime(arg.date);
      const endDate = new Date(arg.date.getTime() + 30 * 60000);
      setEndDateTime(endDate);
      createDummyEvent(arg.date, endDate);
    } else {
      calendarRef.current.getApi().changeView("timeGridDay", arg.date);
    }
  };

  const handleEventClick = (info) => {
    const event = info.event;
    if (event.extendedProps.isDummyEvent) {
      info.jsEvent.cancelBubble = true;
      info.jsEvent.preventDefault();
      console.log("Event:", info.event);
      setShowModal(true);
      setEventDataN({
        id: info.event.id,
        title: info.event._def.title,
        start: info.event._instance.range.start.toISOString().slice(0, -8),
        end: info.event._instance.range.end.toISOString().slice(0, -8),
        location: selectedRoom,
        roomOptions: roomOptions,
        description: "SWM Innovation lab",
        publicEvent: false,
        capacity: "",
        attendees: attendees,
      });
      console.log("Open event popup for dummy event");
    } else {
      // Show alert for other events
      alert("This event cannot be modified. Try the manage booking page.");
    }
  };

  const handleEventChange = (newData) => {
    setEventDataN(newData);
  };

  // Function to send the email
  const sendEmail = async (link) => {
    const eventTitle = eventDataN.title;
    const eventDescription = eventDataN.description;
    const eventStartTime = eventDataN.start;
    const eventEndTime = eventDataN.end;
    const eventLocation = eventDataN.location;
    const attendees = eventDataN.attendees;
    const attendeeList = attendees.join(", ");
    const owner = localStorage.getItem("USER_IL");

    const emailBody = `
    Dear Attendee,

    You are cordially invited to attend the following event:

    Title: ${eventTitle}
    Description: ${eventDescription}
    Start Time: ${eventStartTime}
    End Time: ${eventEndTime}
    Location: ${eventLocation}
    Attendees: ${attendeeList}

    This event is a great opportunity for us to discuss and collaborate. 
    Your presence would be highly appreciated.

    Save meeting: ${link}

    Please do not hesitate to contact us if you require any further information. 

    We look forward to seeing you.

    Best regards,

    ${owner}
    SWM Innovation Lab
    `;

    console.log(emailBody);

    const subject = "Meeting Invitation";
    const emailTo = attendeeList;
    const emailFrom = owner;
    const accessToken = localStorage.getItem("GOOGLE_TOKEN");

    let email = [
      "To: " + emailTo,
      "From: " + emailFrom,
      "Subject: " + subject,
      "",
      emailBody,
    ].join("\r\n");

    // The body needs to be base64url encoded.
    const encodedEmail = btoa(email).replace(/\+/g, "-").replace(/\//g, "_");
    axios({
      method: "post",
      url: "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: {
        raw: encodedEmail,
      },
    })
      .then((response) => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.log("Error sending email");
        console.log(error);
      });
  };

  const handleSaveEvent = async () => {
    try {
      const newEvent = {
        owner: localStorage.getItem("USER_IL") || "",
        team: "dev",
        calendarId: eventDataN.calendar,
        summary: eventDataN.title,
        description: eventDataN.description,
        location: eventDataN.location,
        startDateTime: eventDataN.start,
        endDateTime: eventDataN.end,
        timeZone: "UTC",
        attendees: eventDataN.attendees,
        useDefaultReminders: true,
      };

      // Your code to add the event to Google Calendar...
      console.log(newEvent);
      const response = await axios({
        method: "post",
        url: `http://localhost:3001/events/`,

        headers: {
          "Content-Type": "application/json",
        },
        data: newEvent,
      });

      if (response.status === 200) {
        await sendEmail(response.data.event.htmlLink);        
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

  const handleChangeAttendee = (event) => {
    const value = event.target.value;
    const lastCharacter = value.slice(-1); // Get the last character of the value

    // Check if the last character matches the regular expression
    if (lastCharacter.match(/[, ]+/)) {
      const emails = value.split(/[, ]+/);
      setAttendees(emails);
    }
  };

  const handleAddAttendee = (e) => {
    e.preventDefault();
    if (newAttendee.trim() !== "") {
      setAttendees((prevAttendees) => [...prevAttendees, newAttendee]);
      setNewAttendee("");
      updateTxtColor(newAttendee, getRandomColor);
    }
  };

  const handleDeleteAttendee = (index) => {
    // setAttendees((prevAttendees) =>
    //   prevAttendees.filter((_, i) => i !== index)
    // );
    setAttendees((prevAttendees) => {
      const updatedAttendees = [...prevAttendees];
      const deletedAttendee = updatedAttendees[index];
      delete txtColor[deletedAttendee.name];
      return updatedAttendees.filter((_, i) => i !== index);
    });
    setTxtColor((prevColors) => ({ ...prevColors }));
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
        if (response.ok) {
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
        } else {
          console.log("Error fetching events");
          setRoomEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [selectedCalendar]);

  useEffect(() => {
    const owner = localStorage.getItem("USER_IL") || "";
    const newAttendee = owner;
    const fetchPersonalEvents = async () => {
      try {
        setFcRoomEvents([]);
        const requests = attendees.map(async (owner) => {
          const encodedOwner = encodeURIComponent(owner);
          const response = await fetch(
            serverURL_personalEvents + "/" + encodedOwner
          );
          if (response.ok) {
            const eventsData = await response.json();
            const bgColor = getRandomColor();
            const textC = getContrastText(bgColor);
            const formattedEvents = eventsData.map((event) => ({
              id: event.eventId,
              title: event.summary,
              start: event.startDateTime,
              end: event.endDateTime,
              backgroundColor: bgColor,
              borderColor: bgColor,
              textColor: textC,
            }));
            document.getElementById(owner + "btn").style.color = bgColor;
            return formattedEvents;
          } else {
            return [];
          }
        });
        const eventsByOwner = await Promise.all(requests);
        const mergedEvents = eventsByOwner.flat();
        setFcRoomEvents(mergedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    if (!attendees.includes(newAttendee)) {
      setAttendees((prevAttendees) => [...prevAttendees, newAttendee]);
    } else {
      console.log("Already added");
      fetchPersonalEvents();
    }
  }, [selectedCalendar]);

  useEffect(() => {
    console.log("attendees:", attendees);
    const fetchPersonalEvents = async () => {
      try {
        setFcRoomEvents([]);
        const requests = attendees.map(async (owner) => {
          const encodedOwner = encodeURIComponent(owner);
          const response = await fetch(
            serverURL_personalEvents + "/" + encodedOwner
          );
          if (response.ok) {
            const eventsData = await response.json();
            const bgColor = getRandomColor();
            const textC = getContrastText(bgColor);
            const formattedEvents = eventsData.map((event) => ({
              id: event.eventId,
              title: event.summary,
              start: event.startDateTime,
              end: event.endDateTime,
              backgroundColor: bgColor,
              borderColor: bgColor,
              textColor: textC,
            }));
            document.getElementById(owner + "btn").style.color = bgColor;
            return formattedEvents;
          } else {
            return [];
          }
        });
        const eventsByOwner = await Promise.all(requests);
        const mergedEvents = eventsByOwner.flat();
        setFcRoomEvents(mergedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchPersonalEvents();
  }, [attendees]);

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("roomEvents:", roomEvents);
  }, [roomEvents]);

  useEffect(() => {
    console.log("eventDataN:", eventDataN);
  }, [eventDataN]);

  useEffect(() => {
    console.log("fcRoomEvents:", fcRoomEvents);
  }, [fcRoomEvents]);

  return (
    <div className="calendar">
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel shrink={true} sx={{ position: "static" }}>
          Select your Location
        </InputLabel>
        <Select value={selectedRoom} onChange={handleRoomChange}>
          {roomOptions && Array.isArray(roomOptions) ? (
            roomOptions.map((room, index) => (
              <MenuItem key={index} value={room.name}>
                {room.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">No options available</MenuItem>
          )}
        </Select>
      </FormControl>

      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap", // Added flexWrap property
        }}
      >
        <form onSubmit={handleAddAttendee} style={{ marginRight: "10px" }}>
          <input
            type="text"
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            placeholder="Attendee"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: "50px" }}
          >
            Add
          </Button>
        </form>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "wrap", // Added flexWrap property
          }}
        >
          {attendees.map((attendee, index) => (
            <li key={index} style={{ marginRight: "10px" }}>
              <Button
                id={attendee + "btn"}
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteAttendee(index)}
                sx={{ borderRadius: "50px" }}
              >
                {attendee}
              </Button>
            </li>
          ))}
        </ul>
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
        initialView={zoomedInDate ? "timeGridDay" : "dayGridMonth"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={[...roomEvents, ...fcRoomEvents]}
        timeZone="UTC"
      />
    </div>
  );
}
