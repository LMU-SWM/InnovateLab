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
  attendees: string[];
  googleCalendarEventId: string;
  calendarId: string;
}

interface EventsByOwnerChartProps {
  events: EventData[];
}

const EventsByOwnerChart: React.FC<EventsByOwnerChartProps> = ({ events }) => {
  // Calculate data for the chart
  const ownerCountMap = new Map<string, number>();

  events.forEach((event) => {
    const owner = event.owner;
    if (ownerCountMap.has(owner)) {
      ownerCountMap.set(owner, ownerCountMap.get(owner)! + 1);
    } else {
      ownerCountMap.set(owner, 1);
    }
  });

  const chartData = Array.from(ownerCountMap.entries()).map(([owner, count]) => ({
    name: owner,
    value: count,
  }));

  const COLORS = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
  ];

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Owner
        </Typography>
        <PieChart width={500} height={300}>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
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

export default EventsByOwnerChart;
