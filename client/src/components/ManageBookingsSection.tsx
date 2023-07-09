import React, { useState } from 'react';
import { Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface ManageBookingsSectionProps {
  pendingEvents: Event[];
  completedEvents: Event[];
  onSetOfflineTime: () => void;
}

interface Event {
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
//   status: 'pending' | 'completed';
// }

const ManageBookingsSection: React.FC<ManageBookingsSectionProps> = ({
  pendingEvents,
  completedEvents,
  onSetOfflineTime,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const renderEventRows = (events: Event[]) => {
    if (events.length === 0) {
      // Display 5 empty rows
      const emptyRows = Array(5).fill('');
      return emptyRows.map((_, index) => (
        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#E1F5FE' : 'white' }}>
          <TableCell>No events</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      ));
    } else {
      return events.map((event, index) => (
        <TableRow key={event.eventId} style={{ backgroundColor: index % 2 === 0 ? '#E1F5FE' : 'white' }}>
          <TableCell>{event.summary}</TableCell>
          <TableCell>{event.location}</TableCell>
          <TableCell>{event.owner}</TableCell>
          <TableCell>{event.startDateTime}</TableCell>
          <TableCell>{event.endDateTime}</TableCell>
        </TableRow>
      ));
      
    }
  };

  return (
    <div style={{ background: '#f1f1f1', padding: '1rem' }}>
      <h2>Manage Bookings</h2>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div">
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Set up Innovation Lab Off-line Time
          </Typography>
          <Typography color="text.secondary" onClick={handlePopupOpen} style={{ cursor: 'pointer' }}>
            Total Pending Events Today: {pendingEvents.length}
          </Typography>
          <Typography color="text.secondary" onClick={handlePopupOpen} style={{ cursor: 'pointer' }}>
            Total Completed Events Today: {completedEvents.length}
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={showPopup} onClose={handlePopupClose} maxWidth="md" fullWidth>
        <DialogTitle>Events Today</DialogTitle>
        <DialogContent style={{ background: '#f5f5f5' }}>
          {/* Display the list of pending events */}
          <Typography variant="h6">Pending Events:</Typography>
          <TableContainer component={Paper} style={{ border: '1px solid #ddd' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderEventRows(pendingEvents)}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Display the list of completed events */}
          <Typography variant="h6">Completed Events:</Typography>
          <TableContainer component={Paper} style={{ border: '1px solid #ddd' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderEventRows(completedEvents)}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBookingsSection;
