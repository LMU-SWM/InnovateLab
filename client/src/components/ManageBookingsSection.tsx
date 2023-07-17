import axios from "axios";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";

interface ManageBookingsSectionProps {
  rooms: Room[];
  pendingEvents: Event[];
  completedEvents: Event[];
  onSetOfflineTime: () => void;
}

interface Room {
  _id: string;
  name: string;
  capacity: number;
  items: { name: string; image: string; itemId: string }[];
  roomId: string;
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
  attendees: string[];
  googleCalendarEventId: string;
  calendarId: string;
}
//   status: 'pending' | 'completed';
// }

const ManageBookingsSection: React.FC<ManageBookingsSectionProps> = ({
  rooms,
  pendingEvents,
  completedEvents,
  onSetOfflineTime,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [room, setRoom] = useState("");
  const [reason, setReason] = useState("");
  const [startOfflineTime, setStartOfflineTime] = useState("");
  const [endOfflineTime, setEndOfflineTime] = useState("");
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const serverURL = process.env.REACT_APP_SERVER_URL;
  const serverURL_personalEvents = serverURL + "persoanlEvents";
  const serverURL_events = serverURL + "events";
  const serverURL_calendars = serverURL + "calendars";

  const handleSubmit = async () => {
    try {
      try {
        const calendarResponse = await fetch(
          `${serverURL_calendars}/id?summary=${encodeURIComponent(room)}`
        );
        const calendarData = await calendarResponse.json();
        setSelectedCalendar(calendarData.id);
      } catch (error) {
        console.log("Error fetching calendar options:", error);
      }

      const newEvent = {
        owner: "InnoLab",
        team: "InnoLab",
        calendarId: selectedCalendar,
        summary: reason,
        description: "",
        location: room,
        startDateTime: `${startOfflineTime}:00.000Z`,
        endDateTime: `${endOfflineTime}:00.000Z`,
        timeZone: "UTC",
        attendees: [],
        useDefaultReminders: false,
      };
      console.log("Event: ", newEvent);
      // Your code to add the event to Google Calendar...
      console.log(newEvent);
      const response = await axios({
        method: "post",
        url: `http://localhost:3001/events/`,

        headers: {
          "Content-Type": "application/json",
        },
        data: newEvent,
      });
    } catch (error) {
      console.error("Error adding event:", error);
    }
    // Reset the form after submission
    setRoom("");
    setReason("");
    setStartOfflineTime("");
    setEndOfflineTime("");

    // Close the dialog
    handleOffLinePopupClose();
  };

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };
  const handleOffLinePopupClose = () => {
    setShowOfflinePopup(false);
  };
  const handleOfflinePopupOpen = () => {
    setShowOfflinePopup(true);
  };

  const renderEventRows = (events: Event[]) => {
    if (events.length === 0) {
      // Display 5 empty rows
      const emptyRows = Array(5).fill("");
      return emptyRows.map((_, index) => (
        <TableRow
          key={index}
          style={{ backgroundColor: index % 2 === 0 ? "#E1F5FE" : "white" }}
        >
          <TableCell>No events</TableCell>
          <TableCell />
          <TableCell />
        </TableRow>
      ));
    } else {
      return events.map((event, index) => (
        <TableRow
          key={event.eventId}
          style={{ backgroundColor: index % 2 === 0 ? "#E1F5FE" : "white" }}
        >
          <TableCell>{event.summary}</TableCell>
          <TableCell>{event.location}</TableCell>
          <TableCell>{event.owner}</TableCell>
          <TableCell>{event.startDateTime}</TableCell>
          <TableCell>
            {event.attendees.map((attendee, index) => (
                <div key={index}>{attendee}</div>
            ))}
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <div style={{ background: "#f1f1f1", padding: "1rem" }}>
      <h2>Manage Bookings</h2>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div"></Typography>
          <Typography
            onClick={handleOfflinePopupOpen}
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Set up Innovation Lab Off-line Time
          </Typography>
          <Typography
            color="text.secondary"
            onClick={handlePopupOpen}
            style={{ cursor: "pointer" }}
          >
            Total Pending Events Today: {pendingEvents.length}
          </Typography>
          <Typography
            color="text.secondary"
            onClick={handlePopupOpen}
            style={{ cursor: "pointer" }}
          >
            Total Completed Events Today: {completedEvents.length}
          </Typography>
        </CardContent>
      </Card>
      <Dialog
        open={showPopup}
        onClose={handlePopupClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Events Today</DialogTitle>
        <DialogContent style={{ background: "#f5f5f5" }}>
          {/* Display the list of pending events */}
          <Typography variant="h6">Pending Events:</Typography>
          <TableContainer
            component={Paper}
            style={{ border: "1px solid #ddd" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderEventRows(pendingEvents)}</TableBody>
            </Table>
          </TableContainer>

          {/* Display the list of completed events */}
          <Typography variant="h6">Completed Events:</Typography>
          <TableContainer
            component={Paper}
            style={{ border: "1px solid #ddd" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderEventRows(completedEvents)}</TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showOfflinePopup}
        onClose={handleOffLinePopupClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            p: 2, // Add spacing to all edges
          },
        }}
      >
        <DialogTitle>Set up Innovation Lab Off-line Time</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                label="Room Selector"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                fullWidth
              >
                {rooms.map((room) => (
                  <MenuItem key={room._id} value={room.name}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Offline Time"
                type="datetime-local"
                value={startOfflineTime}
                onChange={(e) => setStartOfflineTime(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Offline Time"
                type="datetime-local"
                value={endOfflineTime}
                onChange={(e) => setEndOfflineTime(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBookingsSection;
