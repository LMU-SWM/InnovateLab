import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

// Import your chart components
import EventsByOwnerChart from "../charts/EventsByOwnerChart";
import EventsByLocationChart from "../charts/EventsByLocationChart";
import EventsByTeamChart from "../charts/EventsByTeamChart";
import EventsByDayOfWeekChart from "../charts/EventsByDayOfWeekChart";
import EventsByMonthChart from "../charts/EventsByMonthChart";
import EventsByTimeOfDayChart from "../charts/EventsByTimeOfDayChart";
import EventsByDurationChart from "../charts/EventsByDurationChart";
import EventsByAttendeesChart from "../charts/EventsByAttendeesChart";

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

interface UsageAnalyticsSectionProps {
  events: EventData[];
}

const UsageAnalyticsSection: React.FC<UsageAnalyticsSectionProps> = ({
  events,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % 10);
    }, 30000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleNextChart = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % 10);
  };

  const handlePreviousChart = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + 10) % 10);
  };

  const renderChart = (index: number) => {
    console.log(index);
    const chartHeight = "40vh";
    switch (index) {
      case 1:
        return (
        <div>
        <EventsByOwnerChart events={events} />
        </div>
        );
      case 2:
        return (
        <div >
          <EventsByLocationChart events={events} />
          </div>
        );
      case 3:
        return (
        <div >
          <EventsByTeamChart events={events} />
          </div>
        );
      case 4:
        return (
        <div >
          <EventsByDayOfWeekChart events={events} />
          </div>
        );
      case 5:
        return (
        <div >
          <EventsByMonthChart events={events} />
          </div>
        );
      case 6:
        return (
        <div >
          <EventsByTimeOfDayChart events={events} />
          </div>
        );
      case 7:
        return (
        <div >
          <EventsByDurationChart events={events} />
          </div>
        );
      case 8:
        return (
        <div >
          <EventsByAttendeesChart events={events} />
          </div>
        );
      case 9:
        return (
        <div >
          <EventsByDayOfWeekChart events={events} />
          </div>
        );
      case 0:
        return (
        <div >
           <EventsByMonthChart events={events} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ background: "#f1f1f1", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Public Events</h2>
        <div>
          <IconButton onClick={handlePreviousChart}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={handleNextChart}>
            <NavigateNextIcon />
          </IconButton>
        </div>
      </div>
      <Card>
        <CardContent>{renderChart(activeIndex)}</CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalyticsSection;
