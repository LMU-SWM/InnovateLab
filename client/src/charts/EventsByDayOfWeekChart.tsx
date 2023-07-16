import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

interface EventsByDayOfWeekChartProps {
  events: EventData[];
}

const EventsByDayOfWeekChart: React.FC<EventsByDayOfWeekChartProps> = ({ events }) => {
  // Calculate data for the chart
  const daysOfWeekCount = [0, 0, 0, 0, 0, 0, 0];

  events.forEach((event) => {
    const eventDate = new Date(event.startDateTime);
    const dayOfWeek = eventDate.getDay();
    daysOfWeekCount[dayOfWeek]++;
  });

  const chartData = [
    { dayOfWeek: 'Sunday', count: daysOfWeekCount[0] },
    { dayOfWeek: 'Monday', count: daysOfWeekCount[1] },
    { dayOfWeek: 'Tuesday', count: daysOfWeekCount[2] },
    { dayOfWeek: 'Wednesday', count: daysOfWeekCount[3] },
    { dayOfWeek: 'Thursday', count: daysOfWeekCount[4] },
    { dayOfWeek: 'Friday', count: daysOfWeekCount[5] },
    { dayOfWeek: 'Saturday', count: daysOfWeekCount[6] },
  ];

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Day of Week
        </Typography>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayOfWeek" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            fill="rgba(54, 162, 235, 0.6)"
            stroke="rgba(54, 162, 235, 1)"
            barSize={30}
          />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default EventsByDayOfWeekChart;
