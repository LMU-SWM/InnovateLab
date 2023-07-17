import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

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
  attendees: string[];
  googleCalendarEventId: string;
  calendarId: string;
}

interface EventsByAttendeesChartProps {
  events: EventData[];
}

const EventsByAttendeesChart: React.FC<EventsByAttendeesChartProps> = ({
  events,
}) => {
  // Calculate data for the chart
  const attendeesCount: { [key: string]: number } = {};

  events.forEach((event) => {
    event.attendees.forEach((attendee) => {
      if (attendeesCount[attendee]) {
        attendeesCount[attendee]++;
      } else {
        attendeesCount[attendee] = 1;
      }
    });
  });

  const chartData = Object.entries(attendeesCount).map(([email, count]) => ({
    email,
    count,
  }));

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Attendees
        </Typography>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="email" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            fill="rgba(75, 192, 192, 0.6)"
            stroke="rgba(75, 192, 192, 1)"
            strokeWidth={1}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default EventsByAttendeesChart;
