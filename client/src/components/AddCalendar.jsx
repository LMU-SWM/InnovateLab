import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from '@fullcalendar/google-calendar';

export default function AddCalendar() {
  const [events, setEvents] = useState([]);

  const handleDateClick = (info) => {
    let newEvents = [...events, 
      { 
        title: 'New Event',
        start: info.dateStr
      }
    ];
    setEvents(newEvents);
  };

  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        googleCalendarApiKey='AIzaSyA-wdWC97RDxARVwgGoynaFlVqso2Sa4Ug'
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
}
