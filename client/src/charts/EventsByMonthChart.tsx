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
  attendees: { email: string }[];
  googleCalendarEventId: string;
  calendarId: string;
}

interface EventsByMonthChartProps {
  events: EventData[];
}

const EventsByMonthChart: React.FC<EventsByMonthChartProps> = ({ events }) => {
  // Calculate data for the chart
  const monthCountMap = new Map<number, number>();

  events.forEach((event) => {
    const eventDate = new Date(event.startDateTime);
    const month = eventDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    if (monthCountMap.has(month)) {
      monthCountMap.set(month, monthCountMap.get(month)! + 1);
    } else {
      monthCountMap.set(month, 1);
    }
  });

  const chartData = Array.from(monthCountMap.entries()).map(([month, count]) => ({
    month,
    events: count,
  }));

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Month
        </Typography>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="events" fill="rgba(54, 162, 235, 0.6)" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default EventsByMonthChart;
