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
        url: "https://www.googleapis.com/calendar/v3/calendars/c766830bf21b3fcefc994a2420463669cc60361e8a9627af791888a574368873@group.calendar.google.com/events",
        headers: {
          Authorization:
            "Bearer ya29.a0AWY7CknN8I5OxnvmSaH75bijNc9n7N2T0bKRIyko9D2R7ZxUaAUu4opbSfjO-WFxxfsqc0xTFywSFl-pvqB8W8vICP_5hlBSJ0OytzERn6LPytCsvFjpBJmR5K5UZ44I0jOwcsU8abCNQIoGssLPAGuFDSNbaCgYKAcASARESFQG1tDrpYoFYqD3QwpHcji3rKuGF3w0163",
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
        url: `https://www.googleapis.com/calendar/v3/calendars/c766830bf21b3fcefc994a2420463669cc60361e8a9627af791888a574368873@group.calendar.google.com/events/${eventId}`,
        headers: {
          Authorization:
            "Bearer ya29.a0AWY7CknN8I5OxnvmSaH75bijNc9n7N2T0bKRIyko9D2R7ZxUaAUu4opbSfjO-WFxxfsqc0xTFywSFl-pvqB8W8vICP_5hlBSJ0OytzERn6LPytCsvFjpBJmR5K5UZ44I0jOwcsU8abCNQIoGssLPAGuFDSNbaCgYKAcASARESFQG1tDrpYoFYqD3QwpHcji3rKuGF3w0163",
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

  useEffect(() => {
    // Refresh events every 10 seconds
    const interval = setInterval(() => {
      calendarRef.current.getApi().refetchEvents();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="calendar">
      <EventPopup
        isOpen={showModal}
        eventData={eventDataN}
        onChange={handleEventChange}
        onSave={handleSaveEvent}
        onCancel={handleCancelEvent}
        onDelete={handleDeleteEvent}
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
        googleCalendarApiKey="AIzaSyA-wdWC97RDxARVwgGoynaFlVqso2Sa4Ug"
        eventSources={[
          {
            googleCalendarId:
              "c766830bf21b3fcefc994a2420463669cc60361e8a9627af791888a574368873@group.calendar.google.com",
            className: "gcal-event",
          },
        ]}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
    </div>
  );
}
