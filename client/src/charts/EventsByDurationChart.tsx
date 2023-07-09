import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

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

interface EventsByDurationChartProps {
  events: EventData[];
}

const EventsByDurationChart: React.FC<EventsByDurationChartProps> = ({ events }) => {
  const durationLabels = ['< 1 Hour', '1-2 Hours', '2-4 Hours', '> 4 Hours'];
  const eventsByDuration = durationLabels.map((duration) =>
    events.filter((event) => {
      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);
      const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (duration === '< 1 Hour') {
        return durationInHours < 1;
      } else if (duration === '1-2 Hours') {
        return durationInHours >= 1 && durationInHours < 2;
      } else if (duration === '2-4 Hours') {
        return durationInHours >= 2 && durationInHours < 4;
      } else if (duration === '> 4 Hours') {
        return durationInHours >= 4;
      }
      return false;
    }).length
  );

  const pieChartData = durationLabels.map((label, index) => ({
    label,
    value: eventsByDuration[index],
  }));

  const COLORS = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
  ];

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Duration
        </Typography>
        <PieChart width={500} height={300}>
          <Pie
            dataKey="value"
            data={pieChartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default EventsByDurationChart;
