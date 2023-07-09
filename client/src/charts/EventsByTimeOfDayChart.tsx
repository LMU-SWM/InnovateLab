import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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

interface EventsByTimeOfDayChartProps {
  events: EventData[];
}

const EventsByTimeOfDayChart: React.FC<EventsByTimeOfDayChartProps> = ({ events }) => {
  // Calculate data for the chart
  const timeOfDayCountMap = new Map<string, number>();

  events.forEach((event) => {
    const startTime = new Date(event.startDateTime);
    const hour = startTime.getHours();

    const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

    if (timeOfDayCountMap.has(timeOfDay)) {
      timeOfDayCountMap.set(timeOfDay, timeOfDayCountMap.get(timeOfDay)! + 1);
    } else {
      timeOfDayCountMap.set(timeOfDay, 1);
    }
  });

  const chartData = Array.from(timeOfDayCountMap.entries()).map(([timeOfDay, count]) => ({
    name: timeOfDay,
    value: count,
  }));

  const COLORS = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(75, 192, 192, 0.6)'];

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Time of Day
        </Typography>
        <PieChart width={500} height={300}>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
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

export default EventsByTimeOfDayChart;
