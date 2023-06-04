import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import axios from "axios";

export default function AddCalendar() {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null); 

  const handleDateClick = async (info) => {
    const newEvent = {
      summary: "New Event",
      location: "Somewhere", // Add this
      start: {
        // Adjust this to reflect the start time of your event
        dateTime: info.dateStr.length < 20 ? `${info.dateStr}T10:00:00` : info.dateStr, // Add a default time of 10:00:00 if no time is provided
        timeZone: "Europe/Berlin",
      },
      end: {
        // Adjust this to reflect the end time of your event
        dateTime: info.dateStr.length < 20 ? `${info.dateStr}T17:00:00` : info.dateStr, // Add a default time of 17:00:00 if no time is provided
        timeZone: "Europe/Berlin",
      },
    };

    try {
      console.log(newEvent)
      const response = await axios({
        method: "post",
        url: "https://www.googleapis.com/calendar/v3/calendars/c766830bf21b3fcefc994a2420463669cc60361e8a9627af791888a574368873@group.calendar.google.com/events",
        headers: {
          Authorization:
            "Bearer ya29.a0AWY7CkmSzVRUP8T1jtPwvwExCUPS9DuEvdxOsJ3aBD9ZojoY3f6NkwunQxvvKqXt3eQtw_29hvzZrq409pHw0zbTXjXrGu25hSqEWnPfI05k8z93tGiWFGd_0n4jT-jo509FYX5ivlMNO6ISlMtyWzhVQWR6Px4aCgYKAf0SARESFQG1tDrpm-ttG5KBLaiBfwCG-ezRRw0166",
          "Content-Type": "application/json",
        },
        data: newEvent,
      });

      if (response.status === 200) {
        console.log("Event added to Google Calendar");
        calendarRef.current.getApi().refetchEvents();
      } else {
        console.error(
          "Error adding event to Google Calendar:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <div className="calendar">
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
        googleCalendarApiKey="AIzaSyA-wdWC97RDxARVwgGoynaFlVqso2Sa4Ug"
        eventSources={[
          {
            googleCalendarId: 'c766830bf21b3fcefc994a2420463669cc60361e8a9627af791888a574368873@group.calendar.google.com',
            className: "gcal-event",
          },
        ]}
        dateClick={handleDateClick}
      />
    </div>
  );
}
