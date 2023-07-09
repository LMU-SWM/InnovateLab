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

interface EventsByTeamChartProps {
  events: EventData[];
}

const EventsByTeamChart: React.FC<EventsByTeamChartProps> = ({ events }) => {
  // Calculate data for the chart
  const teamCountMap = new Map<string, number>();

  events.forEach((event) => {
    const team = event.team;
    if (teamCountMap.has(team)) {
      teamCountMap.set(team, teamCountMap.get(team)! + 1);
    } else {
      teamCountMap.set(team, 1);
    }
  });

  const chartData = Array.from(teamCountMap.entries()).map(([team, count]) => ({
    team,
    events: count,
  }));

  return (
    <Card style={{ height: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Events by Team
        </Typography>
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="team" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="events" fill="rgba(75, 192, 192, 0.6)" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default EventsByTeamChart;
